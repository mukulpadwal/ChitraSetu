import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unathorized Request...", success: false },
        { status: 401 }
      );
    }

    await connectToDB();

    const orders = await Order.find({ placedBy: session.user.id })
      .populate([
        {
          path: "product",
          select: "name description license",
          options: {
            strictPopulate: false,
          },
        },
        {
          path: "variant",
          options: {
            strictPopulate: false,
          },
        },
      ])
      .sort({ createdAt: -1 })
      .select("-razorpayOrderId");

    return NextResponse.json(
      new ApiResponse("User orders fetched successfully...", 200, orders),
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while fetching the user orders ",
      error
    );
    return NextResponse.json(
      { message: "Internal server error while fetching the user orders..." },
      { status: 500 }
    );
  }
}
