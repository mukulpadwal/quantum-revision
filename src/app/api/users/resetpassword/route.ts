import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import sendMail from "@/helpers/sendMail";
import validateEmail from "@/helpers/validateEmail";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const { email } = formData;

        const isValidEmail: boolean = validateEmail(email);

        if (!isValidEmail) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid email address."))
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "No user found with this email address."))
        }

        await sendMail({ email: user.email, emailType: "RESET", userId: user._id, fullName: user.fullName });

        return NextResponse.json(new ApiResponse(true, 200, {}, "Password reset link successfully sent to your email id."));

    } catch (error: any) {
        console.log(`Some error occured : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error."))
    }
}