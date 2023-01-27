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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const users = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please enter a valid email address",
        },
    },
    balance: { type: Number, default: 0 },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    profilePic: { type: String, required: false },
    ownedCourses: [{
            _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' },
            name: { type: String, ref: 'Course' },
            quizmarks: [{
                    quiz_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' },
                    mark: { type: Number, default: 0 },
                }],
        }],
    publishedCourses: [{
            _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' },
            name: { type: String, ref: 'Course' },
        }],
    type: { type: String, default: 'student' },
    cart: [{
            _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' },
            name: { type: String, ref: 'Course' },
            price: { type: Number, ref: 'Course' },
            category: { type: String, ref: 'Course' },
            discounts: [{
                    _id: { type: mongoose_1.default.Types.ObjectId, ref: 'Course' },
                    code: {
                        type: String,
                        required: true,
                        unique: true,
                    },
                    discount: {
                        type: Number,
                        required: true,
                    },
                }]
        }],
}, {
    timestamps: true,
});
users.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        if (!user.isModified("password")) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(config_1.default.get("saltWorkFactor"));
        const hash = yield bcrypt_1.default.hashSync(user.password, salt);
        user.password = hash;
        return next();
    });
});
users.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt_1.default.compare(candidatePassword, user.password).catch((e) => false);
    });
};
const UserModel = mongoose_1.default.model("User", users);
exports.default = UserModel;
