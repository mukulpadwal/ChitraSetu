import { connectToDB } from "@/lib/db";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      [email, password].some(
        (field) => field?.trim() === "" || field === undefined
      )
    ) {
      return NextResponse.json(
        {
          message: "Kindly provide data in all the required fields...",
          success: false,
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email already exists...",
          success: false,
        },
        { status: 400 }
      );
    }

    let user = await User.create({
      email,
      password,
      role: "user",
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Could not register the user...",
          success: false,
        },
        { status: 400 }
      );
    }

    user = await User.findById(user?._id).select("-password");

    return NextResponse.json(
      {
        message: "User registered successfully...",
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal Server Error :: REGISTER USER :: ", error);
    return NextResponse.json(
      {
        message:
          "Something went wrong from server side while registering the user...",
        success: false,
      },
      { status: 500 }
    );
  }
}
