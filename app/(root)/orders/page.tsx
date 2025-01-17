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
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const { status } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const router = useRouter();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {status === "loading" ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="text-gray-500 text-center">No orders found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order: IOrder) => (
                <Card
                  key={`${order?._id}-${(order.product as PopulatedProduct).name}`}
                  className="flex flex-col bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Image Section */}
                  <CardContent className="flex justify-center items-center p-4">
                    <Image
                      src={order?.variant?.imageUrl || "/placeholder.png"}
                      alt={(order.product as PopulatedProduct).name}
                      width={150}
                      height={150}
                      className="object-cover rounded-md shadow-lg"
                    />
                  </CardContent>

                  {/* Details Section */}
                  <div className="flex-1 p-4">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {(order.product as PopulatedProduct).name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {order.variant.type} - Rs {order.variant.price}
                      </CardDescription>
                      <div
                        className={`mt-2 text-sm font-semibold ${getStatusColor(order.status)}`}
                      >
                        Status: {order.status}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Amount:{" "}
                        <span className="font-semibold text-gray-800">
                          Rs {order.amount / 100}{" "}
                          {order.status === "failed" &&
                            "(Amount will be refunded in 5 to 7 business days in case the money was deducted from your account.)"}
                        </span>
                      </div>
                    </CardHeader>

                    <CardFooter className="flex flex-col gap-4 mt-4">
                      {/* Actions based on Order Status */}
                      {order.status === "completed" && (
                        <>
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() =>
                              window.open(order.variant.previewUrl, "_blank")
                            }
                          >
                            View Preview
                          </Button>

                          <Button
                            variant="outline"
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
                                console.error("Error downloading the image:", error);
                              }
                            }}
                          >
                            Download
                          </Button>
                        </>
                      )}

                      {order.status === "pending" && (
                        <div className="text-yellow-500 text-sm">
                          Your order is processing. Please wait.
                        </div>
                      )}

                      {order.status === "failed" && (
                        <div className="text-red-500 text-sm">
                          Payment failed. Please try again.
                        </div>
                      )}

                      {order.status === "refunded" && (
                        <div className="text-blue-500 text-sm">
                          Your order has been refunded.
                        </div>
                      )}

                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() =>
                          router.push(`/orders/success/${order._id}`)
                        }
                      >
                        View Invoice
                      </Button>
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
