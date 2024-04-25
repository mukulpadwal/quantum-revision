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
        const { title, entryDate } = await request.json();

        if (session === null) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
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

        note.firstDate = new Date(new Date(entryDate).getTime() + 86400000 * 1);
        note.secondDate = new Date(new Date(entryDate).getTime() + 86400000 * 3);
        note.thirdDate = new Date(new Date(entryDate).getTime() + 86400000 * 7);

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
