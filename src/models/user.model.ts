import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verifyAccountOtp: {
        type: String
    },
    verifyAccountOtpExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Date
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }]
}, { timestamps: true });

const User = mongoose.models?.users || mongoose.model("users", userSchema);
export default User;