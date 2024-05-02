import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import Query from "@/models/query.model";
import validateEmail from "@/helpers/validateEmail";

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { name, email, userQuery } = await request.json();

        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, `Please enter a valid email address.`)
            );
        }

        const query = await Query.create({
            name: name,
            email: email,
            userQuery: userQuery,
        });

        if (!query) {
            return NextResponse.json(
                new ApiResponse(
                    false,
                    400,
                    {},
                    `Error while submitting your query. Please try again later.`
                )
            );
        }

        return NextResponse.json(
            new ApiResponse(
                true,
                201,
                query,
                "Your query is submitted successfully. Our team will reply to you soon."
            )
        );
    } catch (error: any) {
        console.error(`Failed to store user query : ERROR : ${error}`);
        return NextResponse.json(
            new ApiResponse(
                false,
                500,
                {},
                `Failed to store user query : ERROR : ${error}`
            )
        );
    }
}
