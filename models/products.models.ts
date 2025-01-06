import mongoose, { Schema } from "mongoose";

export const IMAGE_VARIANTS = {
  SQUARE: {
    type: "SQUARE",
    dimensions: {
      width: 1200,
      height: 1200,
    },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  WIDE: {
    type: "WIDE",
    dimensions: {
      width: 1200,
      height: 1200,
    },
    label: "Widescreen (16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: {
      width: 1200,
      height: 1200,
    },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
};

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant {
  type: ImageVariantType;
  proce: number;
  license: "personal" | "commercial";
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
});

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string;
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
    imageUrl: {
      type: String,
      required: true,
    },
    variants: [imageVariantSchema],
  },
  { timestamps: true }
);

export const Product =
  mongoose?.models?.Product ||
  mongoose.model<IProduct>("Product", productSchema);
