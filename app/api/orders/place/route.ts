import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 401 }
      );
    }

    const { productId, variant } = await request.json();

    console.log({ productId, variant });

    if (!mongoose.Types.ObjectId.isValid(productId) || !productId) {
      return NextResponse.json(new ApiResponse("Invalid product id...", 400), {
        status: 400,
      });
    }

    if (variant.length === 0) {
      return NextResponse.json(
        new ApiResponse("Please select a variant...", 400),
        {
          status: 400,
        }
      );
    }

    await connectToDB();

    // Create razorpay order
    const order = await instance.orders.create({
      amount: Math.round(Number(variant.price) * 100),
      currency: "INR",
      receipt: `recept-${Date.now()}`,
      notes: {
        productId: productId.toString(),
        license: variant.license.toString(),
      },
    });

    const newOrder = await Order.create({
      placedBy: session.user.id,
      product: productId,
      variant,
      razorpayOrderId: order.id,
      amount: Math.round(Number(variant.price) * 100),
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
