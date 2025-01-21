import ApiResponse from "@/lib/api-response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    if (id === undefined || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse("Invalid product id..", 400), {
        status: 400,
      });
    }

    await connectToDB();

    const order = await Order.findById(id)
      .populate([
        {
          path: "placedBy",
          select: "email",
          options: {
            strictPopulate: false,
          },
        },
        {
          path: "product",
          select: "name description license -_id",
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
      .select("-razorpayOrderId")
      .lean();

    if (!order) {
      return NextResponse.json(
        new ApiResponse("No order with this id found...", 404),
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      new ApiResponse("Order details fetched successfully...", 200, order),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while fetching product by id ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while fetching order details with id...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}
