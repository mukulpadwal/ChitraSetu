import { connectToDB } from "@/lib/db";
import { Product } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    await connectToDB();

    if (id === undefined || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product id...", success: false },
        {
          status: 400,
        }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "No product with id found...", success: false },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Product with id fetched successfully...",
        data: product,
        success: true,
      },
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
