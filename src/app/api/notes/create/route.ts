import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import Note from "@/models/notes.model";
import Revision from "@/models/revision.model";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import { auth } from "@/auth";


export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { title, date } = await request.json();
        const session = await auth();

        console.log(session);


        if (session === null) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request.")
            );
        }

        const user = await User.findById(session.user._id);


        const note = new Note({
            title,
            entryDate: date,
            owner: session.user._id,
        });
        await note.save();

        const revision = new Revision({
            firstDate: new Date(new Date(date).getTime() + 86400000 * 1),
            secondDate: new Date(new Date(date).getTime() + 86400000 * 3),
            thirdDate: new Date(new Date(date).getTime() + 86400000 * 7),
            note: note._id,
        });
        await revision.save();

        user.notes.push(note._id);
        await user.save();

        return NextResponse.json(
            new ApiResponse(
                true,
                201,
                { note, revision },
                "Note Created Successfully."
            )
        );
    } catch (error: any) {
        console.log(`Error while creating note : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, error.message));
    }
}
