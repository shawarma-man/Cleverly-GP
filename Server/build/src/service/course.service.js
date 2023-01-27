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
exports.findAndUpdateCourse = exports.deleteCourse = exports.createCourse = exports.findCourse = void 0;
const courses_model_1 = __importDefault(require("../models/courses.model"));
function findCourse(query, isOne, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isOne) {
            return courses_model_1.default.findOne(query).lean();
        }
        else {
            return courses_model_1.default.find(query).lean();
        }
    });
}
exports.findCourse = findCourse;
function createCourse(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield courses_model_1.default.create(input);
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.createCourse = createCourse;
function deleteCourse(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return courses_model_1.default.deleteOne(query);
    });
}
exports.deleteCourse = deleteCourse;
function findAndUpdateCourse(query, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return courses_model_1.default.findOneAndUpdate(query, update, options);
    });
}
exports.findAndUpdateCourse = findAndUpdateCourse;
