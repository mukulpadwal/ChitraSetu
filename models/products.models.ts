import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export const IMAGE_VARIANTS = {
  SQUARE: {
    type: "SQUARE",
    dimensions: {
      width: 1200,
      height: 1200, // Keeps the aspect ratio 1:1
    },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  WIDE: {
    type: "WIDE",
    dimensions: {
      width: 1600, // Wider than the height
      height: 900, // Aspect ratio 16:9
    },
    label: "Widescreen (16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: {
      width: 900, // Narrower width for portrait
      height: 1200, // Taller height for portrait
    },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
};

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;
export type ImageVariantLabelType =
  (typeof IMAGE_VARIANTS)[keyof typeof IMAGE_VARIANTS]["label"];

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "personal" | "commercial";
  dimensions?: {
    width?: number;
    height?: number;
  };
  label: ImageVariantLabelType;
  imageUrl: string;
  downloadUrl: string;
  previewUrl: string;
  fileId: string;
}

const imageVariantSchema = new Schema({
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
});

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  variants: ImageVariant[];
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
    variants: [imageVariantSchema],
  },
  { timestamps: true }
);

productSchema.plugin(aggregatePaginate);

export const Product =
  mongoose?.models?.Product ||
  mongoose.model<IProduct>("Product", productSchema);
