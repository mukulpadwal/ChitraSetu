import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      [email, password].some(
        (field) =>
          field === undefined ||
          (typeof field === "string" && field.trim() === "")
      )
    ) {
      return NextResponse.json(
        new ApiResponse("Email and Password are required...", 400),
        {
          status: 400,
        }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        new ApiResponse("No user with this email found...", 404),
        {
          status: 404,
        }
      );
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      return NextResponse.json(new ApiResponse("Invalid Password...", 400), {
        status: 400,
      });
    }

    return NextResponse.json(
      new ApiResponse("User logged in successfully", 200, user),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while login the user ", error);
    return NextResponse.json(new ApiResponse("", 500), {
      status: 500,
    });
  }
}
