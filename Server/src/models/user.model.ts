import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { courses } from "./courses.model";

export interface UserDocument extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    bio: string;
    profilePic: string;
    ownedCourses: Array<{
        _id: mongoose.Types.ObjectId;
        name: string;
        quizmarks: Array<{
            quiz_id: mongoose.Types.ObjectId;
            mark: number;
        }>;
        thumbnail: string;
        rating: number;
        category: string;
    }>;
    publishedCourses: Array<{
        _id: mongoose.Types.ObjectId;
        name: string;
        thumbnail: string;
        rating: number;
        category: string;
    }>;
    type: string;
    cart: [{
        _id: mongoose.Schema.Types.ObjectId
        name: String
        price: Number
        category: String
        rating: Number
        thumbnail: String
        discounts: [{
            _id: mongoose.Schema.Types.ObjectId;
            code: string;
            discount: Number;
        }]
    }];
    card: {
        CardHolder: string;
        CardNumber: string;
        cvv: number;
        expiryDate: string;
        balance: number;
    }
    isVerified: boolean;
    createdAt: Date,
    updatedAt: Date,
    comparePassword(candidatePassword: string): Promise<boolean>
}

const users = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value: string) => {
                const re =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please enter a valid email address",
        },
    },
    isVerified: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    profilePic: { type: String, required: false, default: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png" },
    ownedCourses: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        name: { type: String, ref: 'Course' },
        quizmarks: [{
            quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            mark: { type: Number, default: 0 },
        }],
        thumbnail: { type: String, ref: 'Course' },
        category: { type: String, ref: 'Course' },
        rating: { type: Number, ref: 'Course' },
    }],
    publishedCourses: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        name: { type: String, ref: 'Course' },
        thumbnail: { type: String, ref: 'Course' },
        category: { type: String, ref: 'Course' },
        rating: { type: Number, ref: 'Course' },
    }],
    type: { type: String, default: 'student' },
    cart: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        name: { type: String, ref: 'Course' },
        price: { type: Number, ref: 'Course' },
        thumbnail: { type: String, ref: 'Course' },
        category: { type: String, ref: 'Course' },
        rating: { type: Number, ref: 'Course' },
        discounts: [{
            _id: { type: mongoose.Types.ObjectId, ref: 'Course' },
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
    card: {
        CardNumber: { type: String, ref: 'Bank' },
        CardHolder: { type: String, ref: 'Bank' },
        expiryDate: { type: String, ref: 'Bank' },
        cvv: { type: String, ref: 'Bank' },
        balance: { type: Number, ref: 'Bank' },

    }
}, {
    timestamps: true,
});

users.pre<UserDocument>("save", async function (next) {
    let user = this as UserDocument;

    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
});

users.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((e: Error) => false);
}


const UserModel = mongoose.model<UserDocument>("User", users);

export default UserModel;