import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { User } from "@/models";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        new ApiResponse("Unauthorized request...", 400),
        {
          status: 400,
        }
      );
    }

    const user = await User.findByIdAndDelete(session.user.id).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        new ApiResponse("Could not delete your account...", 400),
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      new ApiResponse("Successfully deleted your account...", 200, user),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Internal server error :: DELETE USER :: ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while deleting your account...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}
