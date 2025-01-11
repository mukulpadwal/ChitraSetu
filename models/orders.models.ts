import mongoose, { Schema } from "mongoose";
import { ImageVariant, ImageVariantType } from "./products.models";

interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  previewUrl: string;
  downloadUrl: string;
  fileId: string;
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | PopulatedUser;
  productId: mongoose.Types.ObjectId | PopulatedProduct;
  variant: ImageVariant;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
        set: (v: string) => v.toUpperCase(),
      },
      price: {
        type: Number,
        required: true,
      },
      license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
      },
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose?.models?.Order || mongoose.model<IOrder>("Order", orderSchema);
