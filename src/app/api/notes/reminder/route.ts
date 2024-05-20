import { auth } from "@/auth";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import Note from "@/models/notes.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await connectToDB();
    try {
        const session = await auth();

        if (session === null) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }

        const today = new Date().toISOString();

        const reminderData = await Note.aggregate([
            {
                $match: {
                    $or: [
                        {
                            firstDate: {
                                $gte: new Date(`${today.slice(0, 10)}T00:00:00.000Z`), // Today's date + 00:00:00
                                $lt: new Date(`${today.slice(0, 10)}T23:59:59.999Z`), // Today's date + 23:59:59
                            },
                        },
                        {
                            secondDate: {
                                $gte: new Date(`${today.slice(0, 10)}T00:00:00.000Z`), // Today's date + 00:00:00
                                $lt: new Date(`${today.slice(0, 10)}T23:59:59.999Z`), // Today's date + 23:59:59
                            },
                        },
                        {
                            thirdDate: {
                                $gte: new Date(`${today.slice(0, 10)}T00:00:00.000Z`), // Today's date + 00:00:00
                                $lt: new Date(`${today.slice(0, 10)}T23:59:59.999Z`), // Today's date + 23:59:59
                            },
                        },
                    ],
                },
            },
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(String(session.user._id)),
                },
            },
            {
                $project: {
                    title: 1,
                },
            },
        ]);


        return NextResponse.json(
            new ApiResponse(
                true,
                200,
                reminderData,
                "Reminder data fetched successfully."
            )
        );
    } catch (error) {
        console.error(
            `Internal server error while fetching reminder data : ERROR : ${error}`
        );
        return NextResponse.json(
            new ApiResponse(
                false,
                500,
                {},
                `Internal server error while fetching reminder data : ERROR : ${error}`
            )
        );
    }
}
