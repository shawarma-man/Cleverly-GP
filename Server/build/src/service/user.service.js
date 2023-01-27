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
exports.findAndUpdateUser = exports.deleteUser = exports.findUser = exports.validatePassword = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const lodash_1 = require("lodash");
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.create(input);
            return (0, lodash_1.omit)(user.toJSON(), 'password', 'ownedCourses', 'publishedCourses');
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.createUser = createUser;
function validatePassword({ email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return false;
        }
        const isValid = yield user.comparePassword(password);
        if (!isValid) {
            return false;
        }
        return (0, lodash_1.omit)(user.toJSON(), 'password', 'ownedCourses', 'publishedCourses');
    });
}
exports.validatePassword = validatePassword;
function findUser(query, isOne, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isOne) {
            return user_model_1.default.findOne(query).lean();
        }
        else {
            return user_model_1.default.find(query).lean();
        }
    });
}
exports.findUser = findUser;
function deleteUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.deleteOne(query);
    });
}
exports.deleteUser = deleteUser;
function findAndUpdateUser(query, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findOneAndUpdate(query, update, options);
    });
}
exports.findAndUpdateUser = findAndUpdateUser;
