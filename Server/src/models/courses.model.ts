import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { string } from "zod";
export interface CoursesDocument extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    rating: number;
    category: string;
    thumbnail: string;
    instructor: {
        _id: mongoose.Types.ObjectId;
        username: string;
    };
    videos: {
        _id: mongoose.Types.ObjectId;
        name: string;
        extension: string;
        video: string;
        description: string;
        duration: string;
        thumbnail: string;
    }[];
    quizes: {
        _id: mongoose.Types.ObjectId;
        submissions: {
            _id: mongoose.Types.ObjectId;
            username: string;
            score: number;
            answers: string[];
        }[];
        name: string;
        description: string;
        num_questions: number;
        questions: {
            q: string;
            choices: string[];
            answer: string;
        }[];
    }[];
    students_count: number;
    students: {
        _id: mongoose.Types.ObjectId;
        username: string;
    }[];
    reviews: {
        _id: mongoose.Types.ObjectId;
        username: string;
        rating: number;
        comment: string;
        profilePic: string;
    }[];
    review_count: number;
    discounts: {
        _id: mongoose.Types.ObjectId;
        code: string;
        discount: number;
    }[];
    zoom: {
        meetingId: string;
        meetingPassword: string;
        meetingTime: string;
    };
}

export const courses = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    thumbnail: { type: String, default: 'https://www.spinutech.com/webres/Image/web-design-development/articles/Web%20Dev-Blog.png' },
    category: {
        type: String,
        required: true,
        enum: ['Development', 'Business', 'Finance', 'IT & Software', 'Office Productivity', 'Personal Development', 'Design', 'Marketing', 'Lifestyle', 'Photography', 'Health & Fitness', 'Music', 'Teaching & Academics'],
    },
    instructor: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String, ref: "User" },
    },
    videos: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            name: String,
            extension: String,
            video: String,
            description: String,
            duration: String,
            thumbnail: String,
        }
    ],
    quizes: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            submissions: [{
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
            _id: { type: mongoose.Types.ObjectId, ref: 'User' },
            username: { type: String, ref: 'User' },
        }
    ],
    discounts: [{
        _id: { type: mongoose.Types.ObjectId },
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
        _id: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, ref: 'User', required: true },
        profilePic: { type: String, ref: 'User', required: true },
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
    zoom: {
        meetingId: String,
        meetingPassword: String,
        meetingTime: String,
        meetingDate: String,
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 15000,// this is the expiry time in seconds
        },
    }
}, {
    timestamps: true,
});


const CoursesModel = mongoose.model<CoursesDocument>("Course", courses);

export default CoursesModel;