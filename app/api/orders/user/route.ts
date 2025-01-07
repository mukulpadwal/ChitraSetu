import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session?.user) {
      return NextResponse.json(
        { message: "Unathorized Request...", success: false },
        { status: 401 }
      );
    }

    await connectToDB();

    const orders = await Order.find({ userId: session.user.id })
      .populate({
        path: "productId",
        select: "namme imageUrl",
        options: {
          strictPopulate: false,
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "User orders fetched successfully...",
        data: orders,
        success: true,
      },
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
