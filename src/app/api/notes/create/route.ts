import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import Note from "@/models/notes.model";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const session = await auth();
        const { title, entryDate, time } = await request.json();

        if (session === null) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }

        // Parse the date-time string to create a Date object
        const date = new Date(entryDate);

        // Check if the parsed date is valid
        if (isNaN(date.getTime())) {
            console.error("Invalid date-time string provided");
        } else {
            // Parse the time string
            const [hours, minutes] = time.split(":").map(Number);

            // Check if the parsed time is valid
            if (
                isNaN(hours) ||
                isNaN(minutes) ||
                hours < 0 ||
                hours > 23 ||
                minutes < 0 ||
                minutes > 59
            ) {
                console.error("Invalid time string provided");
            } else {
                // Combine the date and time
                date.setUTCHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
            }
        }

        const user = await User.findById(session.user._id);

        if (!user) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }

        const note = new Note({
            title: title,
            entryDate: entryDate,
            owner: session.user._id,
        });

        note.firstDate = new Date(new Date(date).getTime() + 86400000 * 1);
        note.secondDate = new Date(new Date(date).getTime() + 86400000 * 3);
        note.thirdDate = new Date(new Date(date).getTime() + 86400000 * 7);

        await note.save();

        user.notes.push(note._id);
        await user.save();

        return NextResponse.json(
            new ApiResponse(true, 201, note, "Note Created Successfully.")
        );
    } catch (error: any) {
        console.log(`Error while creating note : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, error.message));
    }
}
