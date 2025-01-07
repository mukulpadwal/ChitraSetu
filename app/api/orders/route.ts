import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session?.user) {
      return NextResponse.json(
        { message: "Unathorized Request...", success: false },
        { status: 401 }
      );
    }

    const { productId, variant } = await request.json();

    if (
      [productId, variant].some(
        (field) => field?.trim() === "" || field === undefined
      )
    ) {
      return NextResponse.json(
        {
          message: "Some of the required data is missing...",
          success: false,
        },
        { status: 401 }
      );
    }

    await connectToDB();

    // Create razorpay order
    const order = await instance.orders.create({
      amount: variant.price * 100,
      currency: "INR",
      receipt: `recept-${Date.now()}`,
      notes: {
        productId: productId.toString(),
      },
    });

    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      variant,
      razorpayOrderId: order.id,
      amount: variant.price * 100,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Order created successfully...",
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          dbOrderId: newOrder._id,
        },
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Something went wrong while creating order ", error);
    return NextResponse.json(
      {
        message: "Internal server error while creating your order...",
        success: false,
      },
      { status: 500 }
    );
  }
}
