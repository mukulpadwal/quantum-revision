import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db/connectToDB";
import ApiResponse from "@/helpers/ApiResponse";


export async function GET(request: NextRequest) {
  await connectToDB();
  try {
    return NextResponse.json(new ApiResponse(true, 200, {}, "Route is working correctly..."));
  } catch (error: any) {
    console.log(`Something went wrong : ERROR : ${error.message}`);
    return NextResponse.json(new ApiResponse(false, 500, {}, "Internal Server Error..."));
  }
}
