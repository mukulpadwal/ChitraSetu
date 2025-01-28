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
      width: 1600,
      height: 900,
    },
    label: "Widescreen (16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: {
      width: 900,
      height: 1200,
    },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
};

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;
export type ImageVariantLabelType =
  (typeof IMAGE_VARIANTS)[keyof typeof IMAGE_VARIANTS]["label"];

export interface IVariant {
  _id?: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  type: ImageVariantType;
  price: number;
  dimensions?: {
    width: number;
    height: number;
  };
  label: ImageVariantLabelType;
  downloadUrl: string;
  previewUrl: string;
  fileId: string;
  filePath: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const variantSchema = new Schema<IVariant>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
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
  downloadUrl: { type: String, required: true },
  previewUrl: { type: String },
  fileId: { type: String },
  filePath: { type: String },
});

export const Variant =
  mongoose?.models?.Variant ||
  mongoose.model<IVariant>("Variant", variantSchema);
