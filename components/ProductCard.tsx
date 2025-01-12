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
  SelectContent, // Add SelectContent
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageVariant, IProduct } from "@/models/products.models";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "./Loader";

const ProductCard = ({ product }: { product: IProduct }) => {
  const { data: session, status } = useSession();
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
    null
  );

  const handleVariantChange = (variant: ImageVariant) => {
    setSelectedVariant(variant);
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <Card className="max-w-xs mx-auto">
          {/* Product Header */}
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>

          {/* Product Image */}
          <CardContent>
            <Image
              src={product?.previewUrl}
              alt={product?.name}
              width={product?.variants[0]?.dimensions?.width || 100}
              height={product?.variants[0]?.dimensions?.height || 100}
              className="object-cover rounded-md"
            />
          </CardContent>

          {/* Select Variant Dropdown */}
          <CardFooter className="flex flex-col gap-2">
            <Select
              onValueChange={(value) =>
                handleVariantChange(
                  product.variants.find((variant) => variant.type === value)!
                )
              }
              value={selectedVariant?.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>

              {/* Add SelectContent here to wrap SelectItems */}
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.type} value={variant.type as string}>
                    {`${variant?.label || variant.type} - Rs ${
                      variant.price
                    }/-`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Edit & Add to Cart Button. Functionality to be implemented */}
            {product.owner === session?.user.id ? (
              <Button className="mt-2 w-full" variant="default">
                Edit
              </Button>
            ) : (
              <Button className="mt-2 w-full" variant="default">
                Add to Cart -{" "}
                {selectedVariant?.price
                  ? `Rs ${selectedVariant?.price}/-`
                  : "N/A"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ProductCard;
