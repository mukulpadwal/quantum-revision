import { auth } from "@/auth";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";
import { NextResponse, NextRequest } from "next/server";
import novu from "@/helpers/novu";
import Note from "@/models/notes.model";

export async function POST(request: NextRequest) {
  await connectToDB();

  try {
    const session = await auth();
    const {
      _id,
      title,
      firstDate,
      secondDate,
      thirdDate,
      notification,
    } = await request.json();

    if (!session) {
      return NextResponse.json(
        new ApiResponse(false, 400, {}, `Invalid Request.`)
      );
    }

    const note = await Note.findById(_id);

    let response;

    if (notification) {
      response = await novu.trigger("quantum-revision", {
        to: {
          subscriberId: session.user._id,
        },
        payload: {
          subject: `📚 Quantum Revision Reminder: ${title}🚀`,
          email: session.user.email,
          title: title,
          username: session.user.username,
          firstSendAt: new Date(
            new Date(firstDate).getTime() + 86400000
          ).toISOString(),
          secondSendAt: new Date(
            new Date(secondDate).getTime() + 86400000
          ).toISOString(),
          thirdSendAt: new Date(
            new Date(thirdDate).getTime() + 86400000
          ).toISOString(),
        },
      });

      let transactionId = await response?.data?.data?.transactionId;

      note.novuTransactionId = transactionId;
    } else {
      response = await novu.events.cancel(note.novuTransactionId);
      note.novuTransactionId = "";
    }


    if (!response?.data?.data) {
      return NextResponse.json(
        new ApiResponse(
          true,
          400,
          {},
          `Something went wrong  to switch on notification. Please try again later.`
        )
      );
    }

    note.notification = notification;
    await note.save();


    console.log(response.data);

    if (!notification) {
      return NextResponse.json(
        new ApiResponse(true, 200, {}, `Notification switched off succesfully`)
      );
    }

    return NextResponse.json(
      new ApiResponse(true, 200, {}, `Notification switched on succesfully. You will be notified on particular dates to revise the topic.`)
    );
  } catch (error: any) {
    console.error(`Error while sending notification : ERROR : ${error}`);
    return NextResponse.json(
      new ApiResponse(
        false,
        500,
        {},
        `Error while sending notification : ERROR : ${error}`
      )
    );
  }
}
