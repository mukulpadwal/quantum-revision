import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import validatePassword from "@/helpers/validatePassword";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const { oldPassword, newPassword, confirmNewPassword, token } = formData;

        const decodedToken: any = jwt.verify(token, conf.tokenSecret);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))

        }

        if (user.resetPasswordToken !== token) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))
        } else if (Date.now() > user.resetPasswordTokenExpiry) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Token Expired."))
        }

        const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);

        if (!isCorrectPassword) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid Old Password."))
        }



        const isNewPasswordCorrect = validatePassword(newPassword);

        if (!isNewPasswordCorrect) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Oops! It seems your password doesn't meet the minimum requirements. Please ensure your password contains at least one capital letter, one number, one special character, and is longer than 8 characters for enhanced security."))
        }

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Passwords mismatch."))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(new ApiResponse(true, 200, user, "Password changed successfully."))

    } catch (error: any) {
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error."))
    }
}