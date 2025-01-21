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
import { IVariant } from "@/models/variants.model";

const ProductCard = ({ product }: { product: IProduct }) => {
  const { data: session, status } = useSession();
  const [selectedVariant, setSelectedVariant] = useState<IVariant>(
    product?.variants[0] || ({} as IVariant)
  );
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleVariantChange = (value: string) => {
    const selectedVariant = product.variants.find(
      (variant: IVariant) => variant.type === value
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
            {selectedVariant?.imageUrl?.trim()?.length > 0 ? (
              <div className="relative">
                <IKImage
                  src={selectedVariant?.imageUrl}
                  height={selectedVariant.dimensions?.height || 400}
                  width={selectedVariant.dimensions?.width || 400}
                  alt={product?.name}
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] flex justify-center items-center bg-gray-200">
                No Image Available
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
                {product.variants.map((variant: IVariant) => (
                  <SelectItem
                    key={`${variant._id}-${variant.type}`}
                    value={variant.type}
                  >
                    {`${variant?.label || variant.type} - Rs ${variant.price} /-`}
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
