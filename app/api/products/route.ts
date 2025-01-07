import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { Product } from "@/models";
import { IProduct } from "@/models/products.models";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unathorized Request...", success: false },
        { status: 401 }
      );
    }

    await connectToDB();

    const { name, description, imageUrl, variants }: IProduct =
      await request.json();

    if (
      [name, description, imageUrl].some(
        (field) => field?.trim() === "" || field === undefined
      ) ||
      variants.length === 0
    ) {
      return NextResponse.json(
        {
          message: "All fields are required...",
          success: false,
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      imageUrl,
      variants: variants[0],
    });

    return NextResponse.json(
      {
        message: "New Product created successfully...",
        data: product,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Something went wrong while craeting the product ", error);
    return NextResponse.json(
      {
        message: "Internal server error while creating a new product...",
        success: false,
      },
      { status: 500 }
    );
  }
}
