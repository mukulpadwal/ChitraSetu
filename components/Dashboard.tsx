import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Aperture } from "lucide-react";
import { IVariant } from "@/models/variants.models";
import { IKImage } from "imagekitio-next";

type Order = {
  _id: string;
  variant: {
    type: string;
    price: number;
    license: string;
    previewUrl: string;
    imageUrl: string;
  };
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  razorpayPaymentId: string;
  productDetails?: {
    name: string;
    description: string;
    license: string;
  };
  buyerDetails?: {
    email: string;
  };
  variantDetails: IVariant;
};

type DashboardData = {
  _id: string;
  orders: Order[];
  totalAmount: number;
}[];

function Dashboard({ data }: { data: DashboardData }) {
  return (
    <>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 border rounded-lg shadow-md">
          <Aperture className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Data Available
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Currently, there are no orders to display. Please check back later.
          </p>
        </div>
      ) : (
        <div className="p-4 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((group) => (
              <Card
                key={group._id}
                className="p-4 shadow-md border border-gray-200 rounded-lg"
              >
                <CardHeader>
                  <h2 className="text-lg font-semibold capitalize text-gray-800">
                    {group._id}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-primary">
                    ₹{(group.totalAmount / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {data.map((group) => (
              <AccordionItem key={group._id} value={group._id}>
                <AccordionTrigger className="text-lg font-semibold capitalize bg-gray-100 p-4 rounded-md hover:bg-gray-200">
                  {group._id} Orders ({group.orders.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full space-y-6">
                    {group.orders.map((order) => (
                      <Card
                        key={order._id}
                        className="w-full p-2 flex flex-col sm:flex-row items-center sm:justify-between gap-4 bg-gray-50 border rounded-md shadow-sm"
                      >
                        <IKImage
                          src={order.variantDetails.previewUrl}
                          alt={order.variantDetails.type}
                          width={100}
                          height={100}
                        />
                        <div className="w-full flex justify-between">
                          <div>
                            <h3 className="text-md font-semibold text-gray-800">
                              {order.variantDetails.type}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              License: {order?.productDetails?.license}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Created:{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            {/* Product Details */}
                            {order?.productDetails && (
                              <div className="mt-4">
                                <h4 className="text-sm sm:text-md font-semibold text-gray-700">
                                  Product Details:
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {order.productDetails.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {order.productDetails.description}
                                </p>
                              </div>
                            )}

                            {/* Buyer Details */}
                            {order?.buyerDetails && (
                              <div className="mt-4">
                                <h4 className="text-sm sm:text-md font-semibold text-gray-700">
                                  Buyer Details:
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  Email: {order.buyerDetails.email}
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-primary">
                              ₹{(order.amount / 100).toLocaleString()}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {order.status}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
}

export default Dashboard;
