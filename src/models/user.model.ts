import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {

    },
    email: {

    },
    fullName: {

    },
    password: {

    },
    isVerified: {

    },
    isAdmin: {

    },
    verifyAccountToken: {

    },
    verifyAccountTokenExpiry: {

    },
    resetPasswordToken: {

    },
    resetPasswordTokenExpiry: {

    },
    notes: {

    }
}, { timestamps: true });

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;