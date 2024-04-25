import conf from "@/conf/conf";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    await connectToDB();

    try {
        const session = await auth();

        if (session === null) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }

        const userNotesData = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(String(session.user._id)),
                },
            },
            {
                $lookup: {
                    from: "notes",
                    localField: "notes",
                    foreignField: "_id",
                    as: "user_notes",
                    pipeline: [
                        {
                            $project: {
                                title: 1,
                                entryDate: 1,
                                firstDate: 1,
                                secondDate: 1,
                                thirdDate: 1,
                                notification: 1
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    user_notes: 1,
                },
            },
        ]);

        if (userNotesData.length === 0) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Error while fetching notes.")
            );
        }

        return NextResponse.json(
            new ApiResponse(
                true,
                200,
                userNotesData[0],
                "All Notes fetched successfully."
            )
        );
    } catch (error: any) {
        console.log(
            `Error while fetching all the notes : ERROR : ${error.message}`
        );
        return NextResponse.json(new ApiResponse(false, 500, {}, error.message));
    }
}
