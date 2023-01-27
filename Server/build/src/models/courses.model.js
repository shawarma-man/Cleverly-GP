"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courses = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.courses = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: {
        type: String,
        required: true,
        enum: ['Development', 'Business', 'Finance', 'IT & Software', 'Office Productivity', 'Personal Development', 'Design', 'Marketing', 'Lifestyle', 'Photography', 'Health & Fitness', 'Music', 'Teaching & Academics'],
    },
    instructor: {
        _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
        username: { type: String, ref: "User" },
    },
    videos: [
        {
            _id: { type: mongoose_1.default.Schema.Types.ObjectId },
            name: String,
            extension: String,
            video: String,
            description: String,
            duration: String,
        }
    ],
    quizes: [
        {
            quiz_id: { type: mongoose_1.default.Schema.Types.ObjectId },
            submissions: [{
                    _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
                    username: { type: String, ref: 'User' },
                    score: Number,
                    answers: [String],
                }],
            name: String,
            description: String,
            num_questions: Number,
            questions: [{
                    q: String,
                    choices: [String],
                    answer: String,
                }]
        }
    ],
    students_count: { type: Number, default: 0 },
    students: [
        {
            _id: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
            username: { type: String, ref: 'User' },
        }
    ],
    discounts: [{
            _id: { type: mongoose_1.default.Types.ObjectId },
            code: {
                type: String,
                required: true,
                unique: true,
            },
            discount: {
                type: Number,
                required: true,
            },
        }],
    reviews: [{
            _id: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, ref: 'User', required: true },
            rating: {
                type: Number,
                required: true,
                Range: [1, 5],
            },
            comment: {
                type: String,
            },
        }],
    review_count: { type: Number, default: 0 },
}, {
    timestamps: true,
});
const CoursesModel = mongoose_1.default.model("Course", exports.courses);
exports.default = CoursesModel;
