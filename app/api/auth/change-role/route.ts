import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 400 }
      );
    }

    const { role } = await request.json();

    await connectToDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          role,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        new ApiResponse("Could not change role...", 400),
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      new ApiResponse("Role changed successfully...", 200, user),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Internal Server Error :: CHANGE ROLE :: ", error);
    return NextResponse.json(
      new ApiResponse("Internal Server error while changing your role...", 500),
      { status: 500 }
    );
  }
}
