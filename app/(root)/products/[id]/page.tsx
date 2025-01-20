"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { ImageVariant, IProduct } from "@/models/products.models";

const ProductPage = () => {
  const { id }: { id: string } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant>();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setProduct(data?.data);
          setSelectedVariant(data?.data?.variants[0]);
        } else {
          toast.error(data.message);
          router.push("/products");
        }
      });
  }, [id, router]);

  const handleVariantChange = (type: string) => {
    const selected = product?.variants?.find(
      (variant: ImageVariant) => variant?.type === type
    );
    setSelectedVariant(selected);
  };

  async function handlePayment() {
    fetch("/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product?._id,
        variant: selectedVariant,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const { orderId, amount, currency, dbOrderId } = data.data;

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount,
            currency,
            name: "SnapTrade",
            description: `${product?.name} - ${selectedVariant?.type} Version`,
            order_id: orderId,
            handler: function () {
              router.push(`/orders/success/${dbOrderId}`);
            },
            prefill: {
              email: session?.user?.email,
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.error(data.message);
        }
      });
  }

  return (
    <>
      {status === "loading" ? (
        <div className="w-full h-screen flex justify-center items-center gap-2">
          <Camera className="animate-pulse" size={25} />
          Loading...
        </div>
      ) : (
        <div className="md:max-w-7xl min-h-screen mx-auto p-4">
          {/* Product Information */}
          <Card className="min-h-screen flex flex-col md:flex-row justify-around items-center p-4">
            <CardContent className="md:w-6/12 p-4 flex items-center justify-center">
              {selectedVariant?.previewUrl?.trim() ? (
                <Image
                  src={selectedVariant?.previewUrl}
                  alt={product?.name || "Product image"}
                  width={selectedVariant.dimensions?.width || 500}
                  height={selectedVariant.dimensions?.height || 500}
                  className="object-cover rounded-md shadow-lg"
                />
              ) : (
                <div className="w-[225px] h-[225px] sm:w-[500px] sm:h-[500px] flex justify-center items-center bg-gray-200">
                  No Image Available
                </div>
              )}
            </CardContent>

            <div className="md:w-6/12 p-4">
              <CardHeader>
                <CardTitle>{product?.name as string}</CardTitle>
                <CardDescription>{product?.description}</CardDescription>
              </CardHeader>

              {/* Variant Selector */}
              <CardFooter className="flex flex-col gap-4">
                <Select
                  onValueChange={(value) => handleVariantChange(value)}
                  value={selectedVariant?.type || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product?.variants.map((variant: ImageVariant) => (
                      <SelectItem
                        key={`${variant._id}-${variant.type}`}
                        value={variant.type}
                      >
                        {`${variant.type} - Rs ${variant.price}/-`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Buy Now Button */}
                <Button
                  className="w-full"
                  variant="default"
                  onClick={handlePayment}
                >
                  Buy Now -{" "}
                  {selectedVariant?.price
                    ? `Rs ${selectedVariant.price}/-`
                    : "N/A"}
                </Button>
              </CardFooter>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProductPage;
