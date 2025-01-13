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
import Image from "next/image";
import { ImageVariant, IProduct } from "@/models/products.models";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "./Loader";

const ProductCard = ({ product }: { product: IProduct }) => {
  const { data: session, status } = useSession();
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant>(
    product?.variants[0]
  );

  const handleVariantChange = (value: string) => {
    const selectedVariant = product.variants.find(
      (variant: ImageVariant) => variant.type === value
    );
    if (selectedVariant) {
      setSelectedVariant(selectedVariant);
    }
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

          {/* Product Image */}
          <CardContent className="w-full flex justify-center items-center">
            {selectedVariant?.previewUrl?.trim()?.length > 0 ? (
              <Image
                src={selectedVariant?.previewUrl}
                alt={product?.name}
                width={selectedVariant.dimensions?.width || 200}
                height={selectedVariant.dimensions?.height || 200}
                className="object-cover rounded-md"
              />
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
                {product.variants.map((variant: ImageVariant) => (
                  <SelectItem
                    key={`${variant._id}-${variant.type}`}
                    value={variant.type}
                  >
                    {`${variant?.label || variant.type} - Rs ${
                      variant.price
                    }/-`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Edit Button. Functionality to be implemented */}
            {product.owner === session?.user.id ? (
              <Button className="mt-2 w-full" variant="default">
                Edit
              </Button>
            ) : (
              <Button className="mt-2 w-full" variant="default">
                View Full Details
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ProductCard;
