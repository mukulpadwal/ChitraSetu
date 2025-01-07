import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        {
          message: "Invalid Signature",
          success: false,
        },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    await connectToDB();

    if (event?.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order.id,
        },
        {
          razorpayPaymentId: payment.id,
          staus: "completed",
        }
      ).populate([
        {
          path: "productId",
          select: "name",
        },
        {
          path: "userId",
          select: "email",
        },
      ]);

      if (order) {
        const transporter = nodemailer.createTransport({
          host: process.env.MAILTRAP_HOST,
          port: Number(process.env.MAILTRAP_PORT),
          secure: false, // true for port 465, false for other ports
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: '"Mukul From SnapTrade 👻" <mukulpadwal@snaptrade.com>', // sender address
          to: order.userId.email, // list of receivers
          subject: "Order Completed ✔", // Subject line
          text: `Your Order ${order.productId.name} has been placed successfully`, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
      }
    }

    return NextResponse.json(
      {
        message: "Order placed successfully...",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while verifying payment status ",
      error
    );
    return NextResponse.json(
      {
        message: "Internal server error while verifying payment status...",
        success: false,
      },
      { status: 500 }
    );
  }
}
