import mongoose from "mongoose";

const coupons = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

export default mongoose.model("Coupon", coupons);