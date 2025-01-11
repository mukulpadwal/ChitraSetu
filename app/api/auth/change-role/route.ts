import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized Request",
          success: false,
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          role: "admin",
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          message: "Could not change role...",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Role changed successfully...",
        data: user,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while changing user role ", error);
    return NextResponse.json(
      {
        message: "Internal Server error while changing your role...",
        success: false,
      },
      { status: 500 }
    );
  }
}
