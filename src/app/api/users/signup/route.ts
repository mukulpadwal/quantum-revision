import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import validateEmail from "@/helpers/validateEmail";
import validatePassword from "@/helpers/validatePassword";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import sendMail from "@/helpers/sendMail";
import novu from "@/helpers/novu";

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        // Take data fields from the frontend
        const { username, fullName, email, password } = await request.json();

        // STEP 1 : validate the data at the backend also
        if (
            [username, fullName, email, password].some(
                (field) => !field || field?.trim().length === 0
            )
        ) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Some data is missing.")
            );
        }

        // Step 1.1 Validate email by regex
        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Invalid email address.")
            );
        }

        // Step 1.2 Check for unique user
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (userExists !== null) {
            return NextResponse.json(
                new ApiResponse(
                    false,
                    400,
                    {},
                    "User with same email or username already exists."
                )
            );
        }

        // Step 1.3 Check for password length and strength
        const isValidPassword = validatePassword(password);

        if (!isValidPassword) {
            return NextResponse.json(
                new ApiResponse(
                    false,
                    400,
                    {},
                    "Oops! It seems your password doesn't meet the minimum requirements. Please ensure your password contains at least one capital letter, one number, one special character, and is longer than 8 characters for enhanced security."
                )
            );
        }

        // Step 2 : We need to encrypt the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 2.1 : Let us create the user now and send verification email
        const userData = {
            username: username,
            fullName: fullName,
            email: email,
            password: hashedPassword,
        };

        const user = await User.create(userData);

        if (!user) {
            return NextResponse.json(
                new ApiResponse(
                    false,
                    400,
                    {},
                    "Error while creating account. Please try again later."
                )
            );
        }

        // Step 3 : Create a novuSubscriberId for the user
        await novu.subscribers.identify(user._id, {
            email: user.email,
            firstName: user?.fullName?.split(" ")[0],
            lastName: user?.fullName?.split(" ")[1] || "",
            data: {
                username: user?.username,
            },
        });

        // Step 4 : If user is created we need to send him account verification email
        const emailResponse = await sendMail(
            user.email,
            "VERIFY",
            user.username,
            user._id
        );

        if (!emailResponse.success) {
            await User.findByIdAndDelete(user._id);
            return NextResponse.json(
                new ApiResponse(
                    false,
                    emailResponse.statusCode,
                    {},
                    emailResponse.message
                )
            );
        }

        // Step 5 : User successfully registered
        return NextResponse.json(
            new ApiResponse(
                true,
                201,
                user,
                "Account successfully created. Kindly check your email and verify your account."
            )
        );
    } catch (error: any) {
        console.error(
            `Internal server error while signing up a new user : ERROR : ${error}`
        );
        return NextResponse.json(
            new ApiResponse(
                false,
                500,
                {},
                `Internal server error while signing up a new user : ERROR : ${error}`
            )
        );
    }
}
