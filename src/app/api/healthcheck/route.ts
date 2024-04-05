import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";

connectToDB();

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: 200,
      message: "Route is working correctly...",
      data: {},
    });
  } catch (error: any) {
    console.log(`Something went wrong : ERROR : ${error.message}`);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error...",
      data: {},
    });
  }
}
