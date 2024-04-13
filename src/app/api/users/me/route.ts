import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";


export async function GET(request: NextRequest) {
    await connectToDB();

    try {
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))
        }

        const decodedToken: any = jwt.verify(token, conf.tokenSecret);

        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))
        }

        return NextResponse.json(new ApiResponse(true, 200, user, "User details fetched successfully."))
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(false, 500, {}, "Error while fetching user details."))
    }
}