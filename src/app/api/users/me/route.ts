import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/helpers/ApiResponse";
import connectToDB from "@/db/connectToDB";
import { auth } from "@/auth";
import User from "@/models/user.model";

export async function GET(request: NextRequest) {
    await connectToDB();
    const session = await auth();

    try {
        if (!session) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, `Unauthorized Request..`)
            );
        }

        const user = await User.findById(session.user._id);

        if (!user) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, `No user found..`)
            );
        }

        return NextResponse.json(
            new ApiResponse(true, 200, user, `User data fetched successfully.`)
        );
    } catch (error) {
        console.error(`Error while fetching the user details : ERROR : ${error}`);
        return NextResponse.json(
            new ApiResponse(
                false,
                500,
                {},
                `Error while fetching the user details : ERROR : ${error}`
            )
        );
    }
}
