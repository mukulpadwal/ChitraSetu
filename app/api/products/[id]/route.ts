import { connectToDB } from "@/lib/db";
import { Product } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ApiResponse from "@/lib/api-response";
import { auth } from "@/auth";
import imagekit from "@/lib/imagekit";
import { IVariant, Variant } from "@/models/variants.models";

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

    const product = await Product.findById(id).populate({
      path: "variants",
      select: "-owner -downloadUrl -fileId",
      options: {
        strictPopulate: false,
      },
    });

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

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 400 }
      );
    }

    if (id === undefined || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse("Invalid product id..", 400), {
        status: 400,
      });
    }

    const { name, description, variants, license } = await request.json();

    await connectToDB();

    variants.forEach(async (variant: IVariant) => {
      await Variant.findByIdAndUpdate(variant._id, {
        $set: {
          type: variant.type,
          price: variant.price,
          fileId: variant.fileId,
          filePath: variant.filePath,
          downloadUrl: variant.downloadUrl,
          previewUrl: variant.previewUrl,
          dimensions: {
            width: variant.dimensions?.width,
            height: variant?.dimensions?.height,
          },
        },
      });
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          license,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "variants",
      select: "-owner -downloadUrl -fileId",
      options: {
        strictPopulate: false,
      },
    });

    if (!updatedProduct) {
      return NextResponse.json(
        new ApiResponse("No product with id found...", 404),
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      new ApiResponse("Product updated successfully...", 200, updatedProduct),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while updating the product ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while updating your product...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        { status: 400 }
      );
    }

    if (id === undefined || !id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse("Invalid product id..", 400), {
        status: 400,
      });
    }

    await connectToDB();

    const product = await Product.findByIdAndDelete(id).populate({
      path: "variants",
      options: {
        strictPopulate: false,
      },
    });

    if (!product) {
      return NextResponse.json(
        new ApiResponse("No product with id found...", 404),
        {
          status: 404,
        }
      );
    }

    const variants = product.variants as IVariant[];

    const fileIds: string[] = [];

    variants.forEach((variant: IVariant) => fileIds.push(variant.fileId));

    await Variant.deleteMany({ _id: { $in: variants.map((v) => v._id) } });

    await imagekit.bulkDeleteFiles(fileIds);

    // Here i can handle non deleted images logic...

    return NextResponse.json(
      new ApiResponse("Product deleted successfully...", 200),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while deleting the product ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while deleting your product...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}
