import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser, deleteUser, findAndUpdateUser, findUser } from "../service/user.service";
import logger from "../utils/logger";
import { omit, pick } from "lodash";
import UserModel from "../models/user.model";
import couponsModel from "../models/coupons.model";
import CoursesModel from "../models/courses.model";
import { number } from "zod";
import { findAndUpdateCourse, findCourse } from "../service/course.service";
import _ from "lodash";
import jwt from "jsonwebtoken";
import config from "config";
import nodemailer from "nodemailer";
import RTmodel from "../models/ResetToken.model";
import Bank from "../models/bank.model";
///////////////////////// (POST) */api/users* /////////////////////////
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.json(omit(user, "password", "ownedCourses", "publishedCourses"));
  }
  catch (e: any) {
    return res.status(409).json({ message: "Failed To create user" });
  }
}
///////////////////////// (GET) */api/users* /////////////////////////
export async function getUserHandler(
  req: Request,
  res: Response
) {
  const user = await findUser({ _id: req.params.userId }, true);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(omit(user, "password", "card"));
}
///////////////////////// (get) */api/users/profile/get* /////////////////////////
export async function getProfileHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const user = await findUser({ _id: userId }, true);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(omit(user, "password"));
}
///////////////////////// (DELETE) */api/users/:userId* /////////////////////////
export async function deleteUserHandler(req: Request, res: Response) {
  console.log(req.params.userId);
  const result = await deleteUser({ _id: req.params.userId });
  if (!result) return false;
  return res.status(200).json({ message: "User deleted" });
}
///////////////////////// (GET) */api/users/* /////////////////////////
export async function getUsersHandler(req: Request, res: Response) {
  const users = await UserModel.find({}).select("-password  -cart -createdAt -updatedAt -__v -card");
  if (!users) return res.status(404).json({ message: "Users not found" });

  return res.json(users);
}
///////////////////////// (PATCH) */api/users/update* /////////////////////////
export async function updateUserHandler(req: Request, res: Response) {
  const user = res.locals.user;
  const update = req.body;

  const updateFields = _.omit(update, "ownedCourses", "password", 'publishedCourses', 'cart', 'type', '_id', 'card', 'isVerified', 'createdAt', 'updatedAt', '__v');
  console.log(user);
  const updatedUser = await findAndUpdateUser({ _id: user._id }, updateFields, {
    new: true,
  });
  const updateCourse = await findAndUpdateCourse({ instructor: user }, { instructor: updatedUser }, { new: true });
  return res.json(_.omit(updatedUser?.toJSON(), "password", "ownedCourses", "publishedCourses", "card"));
}
///////////////////////// (POST) */api/users/password* /////////////////////////
export async function changePasswordHandler(req: Request, res: Response) {
  const userId = res.locals.user;
  const { oldPassword, newPassword } = req.body;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isValid = await user.comparePassword(oldPassword);

  if (!isValid) {
    return res.status(403).json({ message: "Invalid password" });
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Password changed" });
}
///////////////////////// (POST) */api/users/cart/add/:courseId* /////////////////////////
export async function addToCartHandler(req: Request, res: Response) {
  const user = res.locals.user;
  const userId = res.locals.user._id;
  const courseId = req.params.courseId;
  const course = await CoursesModel.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (String(course.instructor._id) === String(userId)) return res.status(403).json({ message: "You can't add your own course to cart" });
  const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
  if (isEnrolled) {
    return res.status(403).json({ message: "You are already enrolled in this course" });
  }

  const updatedUser = await findAndUpdateUser(
    { _id: userId },
    { $addToSet: { cart: course } },
    { new: true }
  );

  return res.json(_.omit(updatedUser?.toJSON(), "password", "ownedCourses", "publishedCourses", "card"));
}
///////////////////////// (DELETE) */api/users/cart/remove/:courseId* /////////////////////////
export async function removeFromCartHandler(req: Request, res: Response) {
  const user = res.locals.user._id;
  const courseId = req.params.courseId;

  const course = await CoursesModel.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  const updatedUser = await findAndUpdateUser(
    { _id: user },
    { $pull: { cart: { _id: course._id } } },
    { new: true }
  );

  return res.json(_.omit(updatedUser?.toJSON(), "password", "ownedCourses", "publishedCourses", "card"));
}
///////////////////////// (GET) */api/users/cart/get* /////////////////////////
export async function getCartHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const discountCode = req.query.discount;

  // Find the user
  const user = await UserModel.findById(userId).populate("cart");
  if (!user) return res.status(404).json({ message: "User not found" });

  let totalPrice = 0;
  let discount = 0;
  // Loop through the user's cart and calculate the total price
  for (const course of user.cart) {
    // Check if the course has a discount code and if it matches the provided discount code
    if (course.discounts.length > 0 && course.discounts[0].code === discountCode) {
      // Calculate the discounted price
      const discountedPrice = Number(course.price) - (Number(course.price) * Number(course.discounts[0].discount) / 100);
      totalPrice += discountedPrice;
      discount += Number(course.price) - discountedPrice;
    } else {
      totalPrice += Number(course.price);
    }
  }

  // Return the cart contents and the total price
  if (discountCode && discount > 0) return res.json({ cart: user.cart, totalPrice, discount, discountCode });
  return res.json({ cart: user.cart, totalPrice });
}
///////////////////////// (POST) */api/users/cart/checkout* /////////////////////////
export async function checkOutHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const discountCode = req.query.discount;

  // Find the user
  const user = await UserModel.findById(userId).populate("cart");
  if (!user) return res.status(404).json({ message: "User not found" });

  let totalPrice = 0;
  // Loop through the user's cart and calculate the total price
  for (const course of user.cart) {
    console.log(course);
    // Check if the course has a discount code and if it matches the provided discount code
    if (course.discounts.length > 0 && course.discounts[0].code === discountCode) {
      // Calculate the discounted price
      const discountedPrice = Number(course.price) - (Number(course.price) * Number(course.discounts[0].discount) / 100);
      totalPrice += discountedPrice;
    } else {
      totalPrice += Number(course.price);
    }
  }

  // Check if the user has enough balance to buy the courses
  if (totalPrice > 0) {
    const card = await Bank.findOne({ userId: userId });
    if (!card) return res.status(404).json({ message: "You don't have a card added to your account" });
    if (card.balance < totalPrice) return res.status(403).json({ message: "Not enough balance" });
  }

  // Loop through the user's cart and add the courses to the user's owned courses
  for (const course of user.cart) {
    await findAndUpdateUser(
      { _id: userId },
      { $addToSet: { ownedCourses: course } },
      { new: true }
    );
    await findAndUpdateCourse({ _id: course._id }, { $push: { students: user }, $inc: { students_count: 1 } }, {
      new: true,
    });
  }

  // Remove the courses from the user's cart
  await findAndUpdateUser(
    { _id: userId },
    { $set: { cart: [] } },
    { new: true }
  );

  // Decrease the user's balance by the total price
  await Bank.updateOne({ userId: userId }, { $inc: { balance: -totalPrice } });

  return res.status(200).json({ message: "Successfully purchased courses" });
}
///////////////////////// (POST) */api/users/balance/add* /////////////////////////
export async function addBalance(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const coupon = req.body.coupon;

  const isValid = await couponsModel.findOne({ code: coupon });

  if (!isValid) return res.status(404).json({ message: "Invalid coupon" });

  const amount = isValid.amount;

  const Card = await UserModel.findById(userId).populate("card");

  if (!Card) return res.status(404).json({ message: "You don't have a card added to your account" });

  await Bank.updateOne({ userId: userId }, { $inc: { balance: amount } });

  return res.status(200).json({ message: "Successfully added balance" });
}
///////////////////////// (POST) */api/coupon* /////////////////////////
export async function createCouponHandler(req: Request, res: Response) {
  const { code, amount } = req.body;
  const coupon = await couponsModel.findOne({ code: req.params.couponCode });
  if (coupon) return res.status(400).json({ message: "Coupon already exists" });
  const newCoupon = await couponsModel.create({ code, amount });

  return res.json(newCoupon);
}
///////////////////////// (GET) */api/coupon* /////////////////////////
export async function getCouponsHandler(req: Request, res: Response) {
  const coupons = await couponsModel.find();
  if (!coupons) return res.status(404).json({ message: "Coupons not found" });
  return res.status(200).json(coupons);
}
///////////////////////// (DELETE) */api/coupon/:couponCode* /////////////////////////
export async function deleteCouponHandler(req: Request, res: Response) {
  const coupon = await couponsModel.findOneAndDelete({ code: req.params.couponCode });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  return res.status(200).json({ message: "Coupon deleted successfully" });
}

export async function requestVerifyEmailHandler(req: Request, res: Response) {
  const email = req.body.email;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

  const oldToken = await RTmodel.findOne({ userId: user._id });
  if (oldToken) await RTmodel.findByIdAndDelete(oldToken._id);

  const secretKey = config.get<string>("secret");
  const token = jwt.sign({ _id: user._id }, secretKey, {
    expiresIn: "1hr",
  });
  const encodedToken = encodeURIComponent(token);
  await RTmodel.create({ token, userId: user._id });

  const urlBase = config.get<string>("urlBase");
  //code to url encode token

  const url = `${urlBase}/api/users/email/verify/${encodedToken}`;

  const serviceEmail = config.get<string>("email");
  const servicePass = config.get<string>("emailPassword")

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: serviceEmail,
      pass: servicePass,
    },
  });
  const mailOptions = {
    from: "Cleverly™",
    to: email,
    subject: "Verify your email",
    html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
          <title></title>
          
            <style type="text/css">
              @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
        
          .u-row .u-col-100 {
            width: 600px !important;
          }
        
        }
        
        @media (max-width: 620px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: 100% !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
        }
        body {
          margin: 0;
          padding: 0;
        }
        
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
        
        p {
          margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
        
        * {
          line-height: inherit;
        }
        
        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }
        
        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_4 .v-src-width { width: auto !important; } #u_content_image_4 .v-src-max-width { max-width: 43% !important; } #u_content_text_2 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 15px 40px !important; } }
            </style>
          
          
        
        <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
        
        </head>
        
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]-->
            
        
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #6f9de1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <span>&#160;</span>
                </td>
              </tr>
            </tbody>
          </table>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table id="u_content_image_4" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <img align="center" border="0" src="https://i.ibb.co/WvkP5GC/Cleverly-3.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 174px;" width="174" class="v-src-width v-src-max-width"/>
              
            </td>
          </tr>
        </table>
        
              </td>
            </tr>
          </tbody>
        </table>
        
          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>
        
        
        
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div style="color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span style="line-height: 32.4px; font-size: 18px;">Hi ${user.username},</span></strong></span></p>
        <p style="font-size: 14px; line-height: 180%;"> </p>
        <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Tap the button below to confirm your email address. If you didn't create an account with Cleverly, you can safely delete this email.</span></p>
          </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
        <div align="center">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:57px; v-text-anchor:middle; width:260px;" arcsize="77%"  stroke="f" fillcolor="#eb5e28"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->  
            <a href="${url}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #eb5e28; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
              <span style="display:block;padding:20px 70px;line-height:120%;"><strong><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 16.8px;">V E R I F Y   N O W</span></strong></span>
            </a>
          <!--[if mso]></center></v:roundrect><![endif]-->
        </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div style="line-height: 170%; text-align: left; word-wrap: break-word;">
            <p style="line-height: 170%; font-size: 14px;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><span style="line-height: 23.8px; font-size: 14px;"><span style="font-size: 16px; line-height: 27.2px;">If the above button doesn't work, you can copy this link and paste it in your browser</span></span></span></p>
        <p style="font-size: 14px; line-height: 170%;">${url}</p>
        <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">With Regards,</span></p>
        <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span style="font-size: 16px; line-height: 27.2px;">Cleverly™</span></strong></span></p>
          </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>
        
        
        
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #090f13;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #080f30;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div style="color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">You're receiving this email because an email verification request was made on our App.</span></p>
        <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">©2023 Cleverly™</span></p>
          </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>
        
        
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
          </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>
        
        </html>`,
    headers: { 'Content-Type': 'text/html' }
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent" });
  } catch (error: any) {

    return res.status(500).json({ message: "Cannot Send email" });
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const token = req.params.token;
  const decodedToken = decodeURIComponent(token);

  const secretKey = config.get<string>("secret");
  const decoded = jwt.verify(decodedToken, secretKey);
  if (!decoded) return res.status(400).json({ message: "Invalid token" });

  const tokenDetails = await RTmodel.findOne({ token: decodedToken });
  if (!tokenDetails) return res.status(400).json({ message: "Invalid token" });

  const user = await UserModel.findById(tokenDetails.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  await findAndUpdateUser({ _id: user }, { $set: { isVerified: true } }, { new: true });
  await RTmodel.findByIdAndDelete(tokenDetails._id);
  return res.status(200).json({ message: "Email verified" });
}

export async function addCardHandler(req: Request, res: Response) {
  const { CardNumber, expiryDate, cvv, CardHolder } = req.body;
  if (!CardNumber || !expiryDate || !cvv || !CardHolder) return res.status(400).json({ message: "All fields are required" })
  const user = res.locals.user;


  try {
    await Bank.create({
      userId: user._id,
      CardNumber,
      expiryDate,
      cvv,
      CardHolder,
      balance: 543
    });
    await findAndUpdateUser(
      { _id: user._id },
      { $set: { card: { CardNumber: CardNumber, expiryDate: expiryDate, CardHolder: CardHolder, cvv: cvv } } },
      { new: true }
    );
    return res.status(200).json
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
