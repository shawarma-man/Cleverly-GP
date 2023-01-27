import { Request, Response } from "express";
import RTmodel from "../models/ResetToken.model";
import UserModel from "../models/user.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { generateOTP } from "../utils/otp.utils";
import config from "config";

//request password reset
export async function requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    if (user.isVerified === false) {
        return res.status(400).json({ message: "Please verify your email" });
    }
    const oldToken = await RTmodel.findOne({ userId: user._id });
    if (oldToken) {
        await RTmodel.deleteOne({ userId: user._id });
    }
    let resetToken = generateOTP();
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
        html: `<!DOCTYPE html>
        <html lang="en" class="miro" style="background-color:#f3f4f8;font-size:0;line-height:0">
          <head xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en" style="font-family:Helvetica,Arial,sans-serif">
            <meta charset="UTF-8" style="font-family:Helvetica,Arial,sans-serif">
            <title style="font-family:Helvetica,Arial,sans-serif">Title</title>
            <link rel="stylesheet" href="../css/app.css" style="font-family:Helvetica,Arial,sans-serif">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" style="font-family:Helvetica,Arial,sans-serif">
            <meta name="viewport" content="width=device-width" style="font-family:Helvetica,Arial,sans-serif">
          </head>
          <body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;background:#f5f5f5;background-color:#f3f4f8;box-sizing:border-box;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.43;margin:0;min-width:600px;padding:0;text-align:left;width:100%!important">
            <table class="miro__container" align="center" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0;font-family:Helvetica,Arial,sans-serif;max-width:600px;min-width:600px;padding:0;text-align:left;vertical-align:top">
              <tr style="font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top">
                <td class="miro__content-wrapper" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;hyphens:auto;line-height:1.43;margin:0;padding:0;padding-top:43px;text-align:left;vertical-align:top;word-wrap:break-word">
                  <div class="miro__content" style="background-color:#fff;font-family:Helvetica,Arial,sans-serif">
                    <div class="miro__header" style="font-family:Helvetica,Arial,sans-serif;height:100%;min-height:100px;padding:0 40px">
                      <table class="miro__header-content" style="border-collapse:collapse;border-spacing:0;font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tr style="font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top">
                          <td class="miro__col-header-logo" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;hyphens:auto;line-height:1.43;margin:0;padding:0;padding-top:32px;text-align:left;vertical-align:top;width:50%;word-wrap:break-word">
                            <a href="/" target="_blank" style="Margin:0;color:#2a79ff;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.43;margin:0;padding:0;text-align:left;text-decoration:none">
                              <img src="https://i.ibb.co/WvkP5GC/Cleverly-3.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;font-family:Helvetica,Arial,sans-serif;height:120px;max-height:100%;max-width:100%;outline:0;text-decoration:none;width:auto">
                            </a>
                          </td>
                          
                        </tr>
                      </table>
                    </div>
                    <div class="miro__content-body" style="font-family:Helvetica,Arial,sans-serif">
                      <div class="miro-title-block" style="background-position:center;background-repeat:no-repeat;background-size:100% auto;font-family:Helvetica,Arial,sans-serif;padding:40px 40px 36px">
                        <div class="miro-title-block__title font-size-42" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:42px!important;font-stretch:normal;font-style:normal;font-weight:700;letter-spacing:normal;line-height:1.24">Password reset request</div>
                        <div class="miro-title-block__subtitle font-size-20 m-top-16" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:20px!important;font-stretch:normal;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1.4;margin-top:16px;opacity:1">Hi ${user.username},<br></br>Please enter this confirmation code to complete the password reset process</div>
                      </div>
                      <div class="miro-confirmation-code-block" style="font-family:Helvetica,Arial,sans-serif;padding:0 40px">
                        <div class="miro-confirmation-code-block__code" style="background-color:#eb5e28;border-radius:4px;color:#fffcf2;font-family:Helvetica,Arial,sans-serif;font-size:48px;font-stretch:normal;font-style:normal;font-weight:700;height:128px;letter-spacing:normal;line-height:128px;text-align:center">${resetToken}</div>
                      </div>
                      <div class="miro-title-block" style="background-position:center;background-repeat:no-repeat;background-size:100% auto;font-family:Helvetica,Arial,sans-serif;padding:10px 0 0 40px">
                        <div class="miro-title-block__title font-size-42" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:42px!important;font-stretch:normal;font-style:normal;font-weight:700;letter-spacing:normal;line-height:1.24"></div>
                        <div class="miro-title-block__subtitle font-size-20 m-top-16" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:20px!important;font-stretch:normal;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1.4;margin-top:16px;opacity:1">From your reset window, use the code to confirm your PinCode and reset your password.</div>
                                <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">With Regards,</span></p>
                <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span style="font-size: 16px; line-height: 27.2px;">Cleverly™</span></strong></span></p>
                      </div>
                      
                      <div class="miro-title-block" style="background-position:center;background-repeat:no-repeat;background-size:100% auto;font-family:Helvetica,Arial,sans-serif;padding:10px 0 12px 40px">
                        <div class="miro-title-block__title font-size-42" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:42px!important;font-stretch:normal;font-style:normal;font-weight:700;letter-spacing:normal;line-height:1.24"></div>
        
                      </div>
                      <table class="spacer" style="border-collapse:collapse;border-spacing:0;font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tbody style="font-family:Helvetica,Arial,sans-serif">
                          <tr style="font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top">
                            <td height="0px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:0;font-weight:400;hyphens:auto;line-height:0;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row" style="border-collapse:collapse;border-spacing:0;font-family:Helvetica,Arial,sans-serif;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                        <tbody style="font-family:Helvetica,Arial,sans-serif">
                          <tr style="font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top">
                            <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.43;margin:0 auto;padding:0;padding-bottom:0;padding-left:40px;padding-right:40px;text-align:left;width:440px">
                              <table style="border-collapse:collapse;border-spacing:0;font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top;width:100%">
                                <tr style="font-family:Helvetica,Arial,sans-serif;padding:0;text-align:left;vertical-align:top">
        
                                  <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.43;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                                </tr>
                              </table>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                      <div class="miro-title-block" style="background-position:center;background-repeat:no-repeat;background-size:100% auto;font-family:Helvetica,Arial,sans-serif;padding:10px 0 23px 40px">
                        <div class="miro-title-block__title font-size-42" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:42px!important;font-stretch:normal;font-style:normal;font-weight:700;letter-spacing:normal;line-height:1.24"></div>
                        <div class="miro-title-block__subtitle font-size-20 m-top-16" style="color:#090f13;font-family:Helvetica,Arial,sans-serif;font-size:20px!important;font-stretch:normal;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1.4;margin-top:16px;opacity:1">If you didn't request a password reset in Cleverly, please ignore this message.</div>
                      </div>
                      <div class="miro__sep" style="background-color:#000000;font-family:Helvetica,Arial,sans-serif;height:1px"></div>
                    </div>
                  </div>
                  <div class="miro__footer" style="font-family:Helvetica,Arial,sans-serif;padding-bottom:28px;padding-top:28px;background-color:#090f13;">
                    <div class="miro__footer-title" style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-stretch:normal;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1.38;margin-top:0!important;opacity:1;text-align:center">You have received this email because A password reset
                      <br style="font-family:Helvetica,Arial,sans-serif">request was made on ©2023 Cleverly™ applications</div>
                  </div>
                </td>
              </tr>
            </table>
        
            <!-- prevent Gmail on iOS font size manipulation -->
            <div style="display:none;font:15px courier;font-family:Helvetica,Arial,sans-serif;line-height:0;white-space:nowrap">                                                                             
                                                       </div>
          </body>
        </html>`,
        headers: { 'Content-Type': 'text/html' }
    };
    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
    const hashedreset = await bcrypt.hash(resetToken, salt);
    const newToken = new RTmodel({
        userId: user._id,
        token: hashedreset,
    });
    await newToken.save();
    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent" });
    } catch (error: any) {

        return res.status(500).json({ message: "Failed to send email" });
    }
}

//verify token
export async function verifyResetToken(req: Request, res: Response) {
    const { email, resetToken } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const token = await RTmodel.findOne({ userId: user._id });
    if (!token) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
    const isValid = await bcrypt.compare(resetToken, token.token);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
    return res.status(200).json({ message: "Token is valid" });
}

//reset password
export async function resetPassword(req: Request, res: Response) {
    const { email, password, passwordConfirmation, resetToken } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const token = await RTmodel.findOne({ userId: user._id });
    if (!token) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
    const isValid = await bcrypt.compare(resetToken, token.token);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (password !== passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    user.password = password;
    await user.save();
    await RTmodel.deleteOne({ userId: user._id });
    return res.status(200).json({ message: "Password reset successful" });
}