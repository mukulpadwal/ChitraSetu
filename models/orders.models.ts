import mongoose, { Schema } from "mongoose";
import { IVariant } from "./variants.models";

export interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

export interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  license: "personal" | "commercial";
  variants: IVariant[];
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  placedBy: mongoose.Types.ObjectId | PopulatedUser;
  product: mongoose.Types.ObjectId | PopulatedProduct;
  variant: IVariant;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
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
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
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
