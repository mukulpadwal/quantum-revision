import { auth } from "@/auth";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import Note from "@/models/notes.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import novu from "@/helpers/novu";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { noteId: string } }
) {
    const { noteId } = params;
    await connectToDB();

    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request!")
            );
        }

        const user = await User.findById(session.user._id);

        if (!user) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Unauthorized Request!")
            );
        }

        const index = user.notes.indexOf(noteId);

        if (index > -1) {
            // only splice array when item is found
            user.notes.splice(index, 1);
        }

        await user.save();

        const deletedNote = await Note.findByIdAndDelete(noteId);
        if(deletedNote.novuTransactionId){
            await novu.events.cancel(deletedNote.novuTransactionId);
        }

        if (!deletedNote) {
            return NextResponse.json(
                new ApiResponse(false, 400, {}, "Invalid Note.")
            );
        }

        return NextResponse.json(
            new ApiResponse(true, 200, deletedNote, "Note deleted successfully.")
        );
    } catch (error: any) {
        console.log(`Error while deleting note : ERROR : ${error.message}`);
        return NextResponse.json(new ApiResponse(false, 500, {}, error.message));
    }
}
