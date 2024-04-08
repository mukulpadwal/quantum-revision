import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import validateEmail from "@/helpers/validateEmail";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const { email, password } = formData;

        // STEP 1 : validate the data at the backend also
        if ([email, password].some((field) => !field || field?.trim().length === 0)) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Some data is missing."));
        }

        // Step 1.1 Validate email by regex
        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid email address."));
        }

        // Step 2 : We need to find the user and check the password
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "No user with this email address found."));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Incorrect Password."));
        }


        // Step 3 : If the user is verified then only allow login
        if (!user.isVerified) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Kindly verify your account first and then try again."));

        }

        user.isLoggedIn = true;
        await user.save();

        // Step 4 : Create a cookie to send to user
        const cookieToken = jwt.sign({
            _id: user._id
        }, conf.tokenSecret, {
            expiresIn: '1d'
        });

        // Step 5 : Send a cookie
        const response = NextResponse.json(new ApiResponse(true, 200, user, "User successfully Logged In..."));

        response.cookies.set("token", cookieToken, {
            httpOnly: true,
            secure: true
        })

        return response;

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(new ApiResponse(false, 500, {}, `Internal Server Error.`));
    }
}