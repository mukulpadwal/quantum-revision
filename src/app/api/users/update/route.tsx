import { auth } from "@/auth";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDB();
  const session = await auth();

  try {
    if (!session) {
      return NextResponse.json(
        new ApiResponse(false, 400, {}, `Unauthorized Request..`)
      );
    }

    const { username, fullName } = await request.json();

    const user = await User.findOne({ username });

    console.log(user);

    if (user) {
      return NextResponse.json(
        new ApiResponse(
          false,
          400,
          {},
          `Username already taken please try again with some other one..`
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      {
        $set: {
          username: username,
          fullName: fullName,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        new ApiResponse(
          false,
          400,
          {},
          `Something went wrong while updating details. Please try again later.`
        )
      );
    }

    return NextResponse.json(
      new ApiResponse(true, 200, updatedUser, `User data updated successfully.`)
    );
  } catch (error: any) {
    console.error(
      `Internal server error while updating user details : ERROR : ${error}`
    );
    return NextResponse.json(
      new ApiResponse(
        false,
        500,
        {},
        `Internal server error while updating user details : ERROR : ${error}`
      )
    );
  }
}
