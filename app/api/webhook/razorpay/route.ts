import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import ApiResponse from "@/lib/api-response";
import {
  sendConfirmationEmail,
  sendFailureEmail,
  sendRefundEmail,
} from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(new ApiResponse("Invalid Signature...", 401), {
        status: 401,
      });
    }

    const event = await JSON.parse(body);
    await connectToDB();

    if (event?.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment?.order_id,
        },
        {
          $set: {
            razorpayPaymentId: payment?.id,
            status: "completed",
          },
        },
        {
          new: true,
        }
      ).populate([
        {
          path: "product",
          select: "name description label",
        },
        {
          path: "placedBy",
          select: "email",
        },
        {
          path: "variant",
          select: "imageUrl previewUrl",
        },
      ]);

      if (order) {
        await sendConfirmationEmail({
          email: order.placedBy.email,
          createdAt: order.createdAt,
          razorpayPaymentId: order.razorpayPaymentId,
          orderId: order._id.toString(),
          previewUrl: order.variant.previewUrl,
          name: order.product.name,
          description: order.product.description,
          amount: order.amount,
          downloadUrl: order.variant.imageUrl,
        });
      }
    } else if (event?.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment?.order_id,
        },
        {
          $set: {
            razorpayPaymentId: payment?.id,
            status: "failed",
          },
        },
        {
          new: true,
        }
      ).populate([
        {
          path: "product",
          select: "name description label",
        },
        {
          path: "placedBy",
          select: "email",
        },
        {
          path: "variant",
          select: "imageUrl previewUrl",
        },
      ]);

      if (order) {
        await sendFailureEmail({
          email: order.placedBy.email,
          createdAt: order.createdAt,
          razorpayPaymentId: order.razorpayPaymentId,
          orderId: order._id.toString(),
          previewUrl: order.variant.previewUrl,
          name: order.product.name,
          description: order.product.description,
          amount: order.amount,
        });
      }
    } else if (event?.event === "refund.created") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment?.order_id,
        },
        {
          $set: {
            razorpayPaymentId: payment?.id,
            status: "refunded",
          },
        },
        {
          new: true,
        }
      ).populate([
        {
          path: "product",
          select: "name description label",
        },
        {
          path: "placedBy",
          select: "email",
        },
        {
          path: "variant",
          select: "imageUrl previewUrl",
        },
      ]);

      if (order) {
        await sendRefundEmail({
          email: order.placedBy.email,
          createdAt: order.createdAt,
          razorpayPaymentId: order.razorpayPaymentId,
          orderId: order._id.toString(),
          previewUrl: order.variant.previewUrl,
          name: order.product.name,
          description: order.product.description,
          amount: order.amount,
        });
      }
    }

    return NextResponse.json(
      new ApiResponse("Order placed successfully...", 201),
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while verifying payment status ",
      error
    );
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while verifying payment status...",
        500
      ),
      { status: 500 }
    );
  }
}
