import mongoose from "mongoose";

export interface BankDocument extends mongoose.Document {
    CardHolder: string;
    CardNumber: string;
    cvv: number;
    expiryDate: string;
    balance: number;
    owner: mongoose.Schema.Types.ObjectId;
}

const bankSchema = new mongoose.Schema({
    CardHolder: { type: String, required: true },
    CardNumber: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 16,
        unique: true,
    },
    cvv: { type: Number, required: true, min: 100, max: 999 },
    expiryDate: {
        type: String,
        match: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
        required: true
    },
    balance: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
});

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;
