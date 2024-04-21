import conf from "@/conf/conf";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET(request: NextRequest) {
    await connectToDB();

    try {
        const token = request.cookies.get("token")?.value || "";


        if (!token) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }
        const decodedToken: any = jwt.verify(token, conf.tokenSecret);

        const data = await User.aggregate([
            // 1st Pipeline: Let's find the user from id
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(String(decodedToken._id)),
                },
            },
        ]);

        console.log(data);

    } catch (error: any) {
        console.log(`Error while fetching all the notes : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, error.message))
    }
}