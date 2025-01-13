import { connectToDB } from "@/lib/db";
import { Product } from "@/models";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const products = await Product.find({}).lean();

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          message: "No products found...",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "All products fetched successfully...",
        data: products,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while getting the products ", error);
    return NextResponse.json(
      {
        message: "Internal server error while fetching products...",
        success: false,
      },
      { status: 500 }
    );
  }
}
