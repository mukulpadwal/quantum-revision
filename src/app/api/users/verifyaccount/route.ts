import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    await connectToDB();
    try {
        const { username, otp } = await request.json();

        // STEP 1 : validate the data at the backend also
        if ([username, otp].some((field) => !field || field.trim().length === 0)) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorised Request!!!")
            );
        }

        const user = await User.findOne({
            username,
        });

        if (!user) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Invalid Request!!!")
            );
        }

        if (Date.now() > user.verifyAccountOtpExpiry) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "OTP Expired."));
        } else if (otp !== user.verifyAccountOtp) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid OTP."));
        }

        user.isVerified = true;
        user.verifyAccountOtp = undefined;
        user.verifyAccountOtpExpiry = undefined;

        user.save();

        // Step 4 : User successfully registered
        return NextResponse.json(
            new ApiResponse(true, 200, {}, "Account Verified Successfully.")
        );
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(
            new ApiResponse(false, 500, {}, "Internal Server Error.")
        );
    }
}
