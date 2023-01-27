"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponHandler = exports.getCouponsHandler = exports.createCouponHandler = exports.addBalance = exports.getCartHandler = exports.removeFromCartHandler = exports.addToCartHandler = exports.updateUserHandler = exports.getUsersHandler = exports.deleteUserHandler = exports.getUserHandler = exports.createUserHandler = void 0;
const user_service_1 = require("../service/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
const lodash_1 = require("lodash");
const user_model_1 = __importDefault(require("../models/user.model"));
const coupons_model_1 = __importDefault(require("../models/coupons.model"));
const courses_model_1 = __importDefault(require("../models/courses.model"));
///////////////////////// (POST) */api/users* /////////////////////////
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_service_1.createUser)(req.body);
            return res.send((0, lodash_1.omit)(user, "password", "ownedCourses", "publishedCourses"));
        }
        catch (e) {
            logger_1.default.error(e);
            return res.status(409).send(e.message);
        }
    });
}
exports.createUserHandler = createUserHandler;
///////////////////////// (GET) */api/users* /////////////////////////
function getUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_service_1.findUser)({ _id: req.params.userId }, true);
        if (!user)
            return res.status(404).send("User not found");
        return res.send((0, lodash_1.omit)(user, "password"));
    });
}
exports.getUserHandler = getUserHandler;
///////////////////////// (DELETE) */api/users/:userId* /////////////////////////
function deleteUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, user_service_1.deleteUser)({ _id: req.params.userId });
        if (!result)
            return false;
        return res.status(200).send("User deleted");
    });
}
exports.deleteUserHandler = deleteUserHandler;
///////////////////////// (GET) */api/users/:userId* /////////////////////////
function getUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, user_service_1.findUser)({}, false);
        if (!users)
            return false;
        return res.send(users);
    });
}
exports.getUsersHandler = getUsersHandler;
///////////////////////// (PATCH) */api/users/:userId* /////////////////////////
function updateUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const update = req.body;
        const updateId = req.params.userId;
        if (String(updateId) !== userId) {
            return res.sendStatus(403);
        }
        const updatedUser = yield (0, user_service_1.findAndUpdateUser)({ userId }, update, {
            new: true,
        });
        return res.send((0, lodash_1.omit)(updatedUser, "password", "ownedCourses", "publishedCourses"));
    });
}
exports.updateUserHandler = updateUserHandler;
///////////////////////// (POST) */api/users/cart/add/:courseId* /////////////////////////
function addToCartHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user._id;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findById(courseId);
        if (!course)
            return res.status(404).send("Course not found");
        if (String(course.instructor._id) === String(user))
            return res.status(403).send("You can't buy your own course");
        const updatedUser = yield (0, user_service_1.findAndUpdateUser)({ _id: user }, { $addToSet: { cart: course } }, { new: true });
        console.log(updatedUser);
        return res.send((0, lodash_1.omit)(updatedUser, "password", "ownedCourses", "publishedCourses"));
    });
}
exports.addToCartHandler = addToCartHandler;
///////////////////////// (DELETE) */api/users/cart/remove/:courseId* /////////////////////////
function removeFromCartHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user._id;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findById(courseId);
        if (!course)
            return res.status(404).send("Course not found");
        const updatedUser = yield (0, user_service_1.findAndUpdateUser)({ _id: user }, { $pull: { cart: { _id: course._id } } }, { new: true });
        return res.send((0, lodash_1.omit)(updatedUser, "password", "ownedCourses", "publishedCourses"));
    });
}
exports.removeFromCartHandler = removeFromCartHandler;
///////////////////////// (GET) */api/users/cart/get* /////////////////////////
function getCartHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const discountCode = req.query.discount;
        // Find the user
        const user = yield user_model_1.default.findById(userId).populate("cart");
        if (!user)
            return res.status(404).send("User not found");
        let totalPrice = 0;
        console.log(user);
        // Loop through the user's cart and calculate the total price
        for (const course of user.cart) {
            console.log(course);
            // Check if the course has a discount code and if it matches the provided discount code
            if (course.discounts.length > 0 && course.discounts[0].code === discountCode) {
                // Calculate the discounted price
                const discountedPrice = Number(course.price) - (Number(course.price) * Number(course.discounts[0].discount) / 100);
                totalPrice += discountedPrice;
            }
            else {
                totalPrice += Number(course.price);
            }
        }
        // Return the cart contents and the total price
        return res.send({ cart: user.cart, totalPrice });
    });
}
exports.getCartHandler = getCartHandler;
///////////////////////// (POST) */api/users/balance/add* /////////////////////////
function addBalance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const coupon = req.body.coupon;
        const isValid = yield coupons_model_1.default.findOne({ code: coupon });
        if (!isValid)
            return res.status(404).send("Invalid coupon");
        const amount = isValid.amount;
        const updatedUser = yield (0, user_service_1.findAndUpdateUser)({ userId }, { $inc: { balance: amount } }, { new: true });
        return res.send((0, lodash_1.omit)(updatedUser, "password", "ownedCourses", "publishedCourses"));
    });
}
exports.addBalance = addBalance;
///////////////////////// (POST) */api/coupon* /////////////////////////
function createCouponHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, amount } = req.body;
        const newCoupon = yield coupons_model_1.default.create({ code, amount });
        return res.send(newCoupon);
    });
}
exports.createCouponHandler = createCouponHandler;
///////////////////////// (GET) */api/coupon* /////////////////////////
function getCouponsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const coupons = yield coupons_model_1.default.find();
        return res.send(coupons);
    });
}
exports.getCouponsHandler = getCouponsHandler;
///////////////////////// (DELETE) */api/coupon/:couponCode* /////////////////////////
function deleteCouponHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const coupon = yield coupons_model_1.default.findOneAndDelete({ code: req.params.couponCode });
        return res.send(coupon);
    });
}
exports.deleteCouponHandler = deleteCouponHandler;
