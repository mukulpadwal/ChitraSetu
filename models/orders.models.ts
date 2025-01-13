import mongoose, { Schema } from "mongoose";
import { ImageVariant } from "./products.models";

interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  placedBy: mongoose.Types.ObjectId | PopulatedUser;
  product: mongoose.Types.ObjectId | PopulatedProduct;
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
    placedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"],
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
      },
      downloadUrl: { type: String },
      previewUrl: { type: String },
      fileId: { type: String },
      imageUrl: {
        type: String,
        required: true,
      },
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose?.models?.Order || mongoose.model<IOrder>("Order", orderSchema);
