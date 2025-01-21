import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { Product } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 400 }
      );
    }

    await connectToDB();

    const products = await Product.find({ owner: session.user.id })
      .populate({
        path: "variants",
        options: {
          strictPopulate: false,
        },
      })
      .lean();

    if (products.length === 0 || !products) {
      return NextResponse.json(new ApiResponse("No Products listed...", 404), {
        status: 404,
      });
    }

    return NextResponse.json(
      new ApiResponse("Listed products fetched successfully...", 200, products),
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while fetching listed products from the current user ",
      error
    );
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while fetching listed products.",
        500
      ),
      { status: 500 }
    );
  }
}
