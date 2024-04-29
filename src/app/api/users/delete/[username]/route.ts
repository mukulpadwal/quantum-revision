import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/helpers/ApiResponse";
import connectToDB from "@/db/connectToDB";
import { auth } from "@/auth";
import User from "@/models/user.model";
import Note from "@/models/notes.model";
import sendMail from "@/helpers/sendMail";


export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  await connectToDB();

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        new ApiResponse(false, 400, {}, `Unauthorized Request..`)
      );
    }

    if (session.user.username !== username) {
      return NextResponse.json(
        new ApiResponse(false, 400, {}, `Unauthorized Request..`)
      );
    }

    const user = await User.findByIdAndDelete(session.user._id);
    await Note.deleteMany({ owner: user._id });

    if (!user) {
      return NextResponse.json(
        new ApiResponse(false, 400, {}, `No user found..`)
      );
    }

    await sendMail(user.email, 'DELETE', user.username, user._id);

    return NextResponse.json(
      new ApiResponse(true, 200, user, `User deleted successfully.`)
    );
  } catch (error: any) {
    console.error(`Error while deleting the user : ERROR : ${error}`);
    return NextResponse.json(
      new ApiResponse(
        false,
        500,
        {},
        `Error while deleting the user : ERROR : ${error}`
      )
    );
  }
}
