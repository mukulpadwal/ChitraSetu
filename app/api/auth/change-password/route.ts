import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 400 }
      );
    }

    const { currPassword, newPassword } = await request.json();

    await connectToDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(new ApiResponse("No user found...", 400), {
        status: 400,
      });
    }

    const isPasswordValid = await user.isPasswordValid(currPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        new ApiResponse("Invalid old password...", 400),
        {
          status: 400,
        }
      );
    }

    user.password = newPassword;
    await user.save({ validateBeforeDave: false });

    return NextResponse.json(
      new ApiResponse("Password changed successfully...", 201),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Something went wrong while changing user password ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while changing user password...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}
