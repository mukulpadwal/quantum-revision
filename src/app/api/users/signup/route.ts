import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import validateEmail from "@/helpers/validateEmail";
import validatePassword from "@/helpers/validatePassword";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const { firstName, lastName, email, password } = formData;

        // STEP 1 : validate the data at the backend also
        if ([firstName, lastName, email, password].some((field) => !field || field?.trim().length === 0)) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Some data is missing."));
        }

        // Step 1.1 Validate email by regex
        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Invalid email address."));
        }

        // Step 1.2 Check for password length and strength
        const isValidPassword = validatePassword(password);

        if (!isValidPassword) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Password must be 8 characters and long. And must contain atleast one number and one special character."));
        }

        // Step 2 : We need to encrypt the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 2 : Let us create the user now and send verification email
        const userData = {
            username: firstName.trim().toLowerCase() + lastName.trim().toLowerCase(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword
        }

        const user = await User.create(userData);

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Error while creating account. Please try again later."));
        }

        // Step 3 : If user is created we need to send him account verification email
        //TODO

        // Step 4 : User successfully registered
        return NextResponse.json(new ApiResponse(true, 201, user, "Account successfully created..."));

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(new ApiResponse(false, 500, {}, `Internal Server Error.`));
    }
}