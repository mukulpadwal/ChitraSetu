"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/models/products.models";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";
import { IKImage } from "imagekitio-next";
import toast from "react-hot-toast";
import { IMAGE_VARIANTS, IVariant } from "@/models/variants.models";

const ProductCard = ({ product }: { product: IProduct }) => {
  const { data: session, status } = useSession();
  const [selectedVariant, setSelectedVariant] = useState<IVariant>(
    product?.variants[0] as IVariant
  );
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleVariantChange = (value: string) => {
    const selectedVariant = product.variants.find(
      (variant): variant is IVariant => (variant as IVariant).type === value
    );
    if (selectedVariant) {
      setSelectedVariant(selectedVariant);
    }
  };

  const handleDeleteProduct = async (
    id: mongoose.Types.ObjectId | undefined
  ) => {
    setIsPending(true);
    fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          window.location.reload();
        } else {
          toast.error(data.message);
        }
      })
      .catch(() =>
        toast.error("Something went wrong while deleting the product...")
      )
      .finally(() => setIsPending(false));
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <Card className="max-w-xs mx-auto">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>

          <CardContent className="w-full flex justify-center items-center">
            {selectedVariant?.filePath?.trim() && (
              <div
                className="relative w-full"
                style={{
                  aspectRatio:
                    IMAGE_VARIANTS[selectedVariant?.type]?.dimensions.width /
                    IMAGE_VARIANTS[selectedVariant?.type]?.dimensions.height,
                }}
              >
                <IKImage
                  path={selectedVariant?.filePath}
                  lqip={{ active: true, quality: 20 }}
                  transformation={[
                    {
                      height:
                        IMAGE_VARIANTS[
                          selectedVariant?.type
                        ]?.dimensions.height.toString(),
                      width:
                        IMAGE_VARIANTS[
                          selectedVariant?.type
                        ]?.dimensions.width.toString(),
                      focus: "center",
                      quality: Number("10"),
                    },
                    {
                      raw: "l-text,i-ChitraSetu,lx-50,ly-50,tg-b,bg-black,pa-10,co-white,ff-SirinStencil-Regular.ttf,fs-45,rt-N45,l-end",
                    },
                  ]}
                  loading="lazy"
                  alt={product?.name}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Select
              onValueChange={(value: string) => handleVariantChange(value)}
              value={selectedVariant?.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>

              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem
                    key={`${variant._id}-${(variant as IVariant).type}`}
                    value={(variant as IVariant).type}
                  >
                    {`${(variant as IVariant)?.label || (variant as IVariant).type} - Rs ${(variant as IVariant).price} /-`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {product.owner === session?.user.id && (
              <div className="w-full flex flex-row justify-center items-center gap-2">
                <Button
                  className="w-full flex flex-row items-center justify-center"
                  variant="outline"
                  onClick={() => router.push(`/products/edit/${product?._id}`)}
                >
                  <Pencil /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex flex-row items-center justify-center"
                  onClick={() => handleDeleteProduct(product?._id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" /> Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 /> Delete
                    </>
                  )}
                </Button>
              </div>
            )}
            <Button
              variant="default"
              className="w-full flex flex-row items-center justify-center"
              onClick={() => router.push(`/products/${product._id}`)}
            >
              <Eye /> View Full Details
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ProductCard;
