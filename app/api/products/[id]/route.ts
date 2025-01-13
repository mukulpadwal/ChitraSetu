import { connectToDB } from "@/lib/db";
import { Product } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ApiResponse from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    await connectToDB();

    if (id === undefined || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse("Invalid product id..", 400), {
        status: 400,
      });
    }

    const product = await Product.findById(id).select(
      "-variants.downloadUrl -createdAt -updatedAt -__v"
    );

    if (!product) {
      return NextResponse.json(
        new ApiResponse("No product with id found...", 404),
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      new ApiResponse("Product with id fetched successfully...", 200, product),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while fetching product by id ", error);
    return NextResponse.json(
      {
        message: "Internal server error while fetching product with id...",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
