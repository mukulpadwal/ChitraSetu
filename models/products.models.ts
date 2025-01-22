import mongoose, { Schema } from "mongoose";
import { IVariant } from "./variants.models";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  variants: mongoose.Types.ObjectId[] | IVariant[];
  license: "personal" | "commercial";
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant",
        index: true,
      },
    ],
    license: {
      type: String,
      required: true,
      enum: ["personal", "commercial"],
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose?.models?.Product ||
  mongoose.model<IProduct>("Product", productSchema);
