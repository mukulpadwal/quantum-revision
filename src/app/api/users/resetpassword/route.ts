import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import sendMail from "@/helpers/sendMail";
import validateEmail from "@/helpers/validateEmail";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await connectToDB();
    
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

        const emailResponse = await sendMail(
            user.email,
            "RESET",
            user.username,
            user._id
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                new ApiResponse(
                    false,
                    emailResponse.statusCode,
                    {},
                    emailResponse.message
                )
            );
        }

        return NextResponse.json(new ApiResponse(true, 200, {}, "Password reset link successfully sent to your email id."));

    } catch (error: any) {
        console.log(`Some error occured : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error."))
    }
}