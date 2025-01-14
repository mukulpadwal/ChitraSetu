"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IOrder, PopulatedProduct } from "@/models/orders.models";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

const OrdersPage = () => {
  const { status } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
  }, []);

  return (
    <>
      {status === "loading" ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: IOrder) => (
                <Card
                  key={`${order?._id}-${
                    (order.product as PopulatedProduct).name
                  }`}
                  className="flex flex-col lg:flex-row items-center"
                >
                  {/* Image Section */}
                  <CardContent className="flex-1 flex justify-center items-center p-6">
                    <Image
                      src={order?.variant?.imageUrl}
                      alt={(order.product as PopulatedProduct).name}
                      width={150}
                      height={150}
                      className="object-cover rounded-md shadow-lg"
                    />
                  </CardContent>

                  {/* Details Section */}
                  <div className="flex-1 p-6">
                    <CardHeader>
                      <CardTitle>
                        {(order.product as PopulatedProduct).name}
                      </CardTitle>
                      <CardDescription>
                        {order.variant.type} - Rs {order.variant.price}
                      </CardDescription>
                      <div className="mt-2 text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            order.status === "completed"
                              ? "text-green-500"
                              : order.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Amount:{" "}
                        <span className="font-semibold">
                          Rs {order.amount / 100}{" "}
                          {order.status === "failed" &&
                            "(Amount will be refunded in 5 to 7 business days in case the money was deducted from your account.)"}
                        </span>
                      </div>
                    </CardHeader>

                    <CardFooter className="flex flex-col gap-2">
                      {order.status === "completed" && (
                        <>
                          {/* Preview URL */}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              window.open(order.variant.previewUrl, "_blank")
                            }
                          >
                            View Preview
                          </Button>

                          {/* Download URL */}
                          <Button
                            variant={"outline"}
                            className="w-full"
                            onClick={async () => {
                              try {
                                const imageUrl = order.variant.imageUrl;

                                const response = await fetch(imageUrl, {
                                  mode: "cors",
                                });

                                if (!response.ok) {
                                  toast.error("Failed to fetch image");
                                  return;
                                }
                                const blob = await response.blob();

                                const blobUrl = URL.createObjectURL(blob);

                                const link = document.createElement("a");
                                link.href = blobUrl;
                                link.download = "product-image.png";

                                link.click();

                                URL.revokeObjectURL(blobUrl);
                              } catch (error) {
                                console.error(
                                  "Error downloading the image:",
                                  error
                                );
                              }
                            }}
                          >
                            Download
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrdersPage;
