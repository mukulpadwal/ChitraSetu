import { auth } from "@/auth";
import ApiResponse from "@/lib/api-response";
import { connectToDB } from "@/lib/db";
import { Order } from "@/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        new ApiResponse("Unauthorized Request...", 400),
        {
          status: 400,
        }
      );
    }

    await connectToDB();

    const orderDetails = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
          pipeline: [
            {
              $project: {
                name: 1,
                description: 1,
                owner: 1,
                license: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "placedBy",
          foreignField: "_id",
          as: "buyerDetails",
          pipeline: [
            {
              $project: {
                email: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "variants",
          localField: "variant",
          foreignField: "_id",
          as: "variantDetails",
        },
      },
      {
        $addFields: {
          productDetails: {
            $arrayElemAt: ["$productDetails", 0],
          },
          buyerDetails: {
            $arrayElemAt: ["$buyerDetails", 0],
          },
          variantDetails: {
            $arrayElemAt: ["$variantDetails", 0],
          },
        },
      },
      {
        $match: {
          "productDetails.owner": mongoose.Types.ObjectId.createFromHexString(
            session.user.id.toString()
          ),
        },
      },
      {
        $group: {
          _id: "$status",
          orders: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $addFields: {
          totalAmount: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: "$$order.amount",
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json(
      new ApiResponse("Data fetched successfully...", 200, orderDetails),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while fetching dashboard data ", error);
    return NextResponse.json(
      new ApiResponse(
        "Internal server error while fetching dashboard data...",
        500
      ),
      {
        status: 500,
      }
    );
  }
}
