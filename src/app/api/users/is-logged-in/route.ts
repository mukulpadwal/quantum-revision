import conf from "@/conf/conf";
import ApiResponse from "@/helpers/ApiResponse";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))
        }

        const decodedToken: any = jwt.verify(token, conf.tokenSecret);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "Unauthorized Request."))
        }

        if (!user.isLoggedIn) {
            return NextResponse.json(new ApiResponse(false, 400, {}, "User is not logged in."));

        }

        return NextResponse.json(new ApiResponse(true, 200, {}, "User is logged in."));
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error"))
    }
}