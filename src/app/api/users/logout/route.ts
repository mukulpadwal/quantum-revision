import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";



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

        user.isLoggedIn = false;
        await user.save();

        const response = NextResponse.json(new ApiResponse(true, 200, {}, "Logged out successfully."));
        response.cookies.delete("token");

        return response;


    } catch (error: any) {
        return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error"))
    }
}