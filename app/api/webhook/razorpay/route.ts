import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import nodemailer from "nodemailer";
import ApiResponse from "@/lib/api-response";

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
          select: "name description",
        },
        {
          path: "placedBy",
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
          to: order.placedBy.email, // list of receivers
          subject: "Order Completed ✔", // Subject line
          text: `Your Order ${order.product.name} has been placed successfully`, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
      }

      return NextResponse.json(
        new ApiResponse("Order placed successfully...", 201),
        { status: 201 }
      );
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
          select: "name description",
        },
        {
          path: "placedBy",
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
          to: order.placedBy.email, // list of receivers
          subject: "Order Failed ❌", // Subject line
          text: `Your Order ${order.product.name} could not been placed.`, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
      }

      return NextResponse.json(
        new ApiResponse("Could not placed your order...", 400),
        { status: 400 }
      );
    }
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
