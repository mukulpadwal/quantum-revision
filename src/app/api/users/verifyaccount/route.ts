import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const tokenData = await request.json();
        const { verificationToken } = tokenData;

        // STEP 1 : validate the data at the backend also
        if (!verificationToken) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorised Request!!!"));
        }

        // Step 2 : Retrieve User Id from the token
        const decodedToken: any = jwt.verify(verificationToken, conf.tokenSecret);

        const user = await User.findById(decodedToken._id);

        if (Date.now() > user.verifyAccountTokenExpiry) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Token Expired."));
        } else if (verificationToken !== user.verifyAccountToken) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid Token."));
        }

        user.isVerified = true;
        user.verifyAccountToken = undefined;
        user.verifyAccountTokenExpiry = undefined;

        user.save();

        // Step 4 : User successfully registered
        return NextResponse.json(new ApiResponse(true, 200, {}, "Account Verified Successfully."));

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error."));
    }
}