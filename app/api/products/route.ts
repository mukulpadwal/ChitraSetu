import ApiResponse from "@/lib/api-response";
import { IProduct } from "@/models/products.models";
import { connectToDB } from "@/lib/db";
import { Product } from "@/models";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const products: IProduct[] = await Product.find({}).populate({
      path: "variants",
      select: "-owner -downloadUrl -imageUrl -fileId",
      options: {
        strictPopulate: false,
      },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(new ApiResponse("No products found...", 404), {
        status: 404,
      });
    }

    return NextResponse.json(
      new ApiResponse("All products fetched successfully...", 200, products),
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while getting the products ", error);
    return NextResponse.json(
      new ApiResponse("Internal server error while fetching products...", 500),
      { status: 500 }
    );
  }
}
