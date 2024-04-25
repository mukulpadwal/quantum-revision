import { NextRequest, NextResponse } from "next/server";
import novu from "@/helpers/novu";
import ApiResponse from "@/helpers/ApiResponse";

export async function DELETE(request: NextRequest) {
    try {
        // TODO

        return NextResponse.json(
            new ApiResponse(true, 200, {}, `User deleted successfully.`)
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
