import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  IOrder,
  PopulatedProduct,
  PopulatedUser,
} from "@/models/orders.models";
import { Aperture } from "lucide-react";

const Invoice = ({ order }: { order: IOrder }) => {
  const {
    amount,
    razorpayPaymentId,
    status,
    variant: { type, price, license, imageUrl },
    createdAt,
  } = order;

  const { email } = (order?.placedBy as PopulatedUser) || {};
  const { name, description } = (order?.product as PopulatedProduct) || {};

  return (
    <>
      {/* Apply styles for printing */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              width: 100%;
              max-width: 100%;
              padding: 20px;
              font-size: 12px;
            }
            .invoice-container * {
              font-size: 12px !important;
            }
            .invoice-container h1, .invoice-container h2, .invoice-container h3 {
              font-size: 18px !important;
            }
            .invoice-container .card {
              margin-bottom: 10px;
            }
            .invoice-container .print-button {
              display: none;
            }
            .invoice-container .separator {
              margin: 10px 0;
            }
          }
        `}
      </style>

      <div className="invoice-container flex flex-col p-6 gap-6 max-w-3xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Aperture className="text-4xl text-gray-800 mr-2" />
            <h1 className="text-4xl font-semibold text-gray-800">SnapTrade</h1>
          </div>
          <Badge
            variant={
              status === "completed"
                ? "outline"
                : status === "failed"
                ? "destructive"
                : status === "refunded"
                ? "secondary"
                : "default"
            }
            className="text-lg"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Invoice</h2>

        <Card className="shadow-lg rounded-xl mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Details of the order placed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <p className="font-medium">Order ID:</p>
              <p>{razorpayPaymentId}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Placed By:</p>
              <p>{email || "N/A"}</p>{" "}
              {/* Fallback to "N/A" if email is not available */}
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Date:</p>
              <p>{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="shadow-lg rounded-xl mb-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Information about the purchased product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Avatar>
                <AvatarImage src={imageUrl} alt={name || "Product"} />
                <AvatarFallback>{name ? name.charAt(0) : "P"}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-medium text-xl text-gray-800">
                  {name || "Unknown Product"}
                </p>
                <p className="text-sm text-gray-600">
                  {description || "No description available."}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  License: {license || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Variant:</p>
              <p>{type || "N/A"}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="font-medium">Price:</p>
              <p className="font-semibold">{price || 0} INR</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="shadow-lg rounded-xl mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Summary of the total payment made.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <p className="font-medium">Total Amount:</p>
              <p className="font-semibold">{amount / 100 || 0} INR</p>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="default"
          className="w-full mt-4 print-button"
          onClick={() => window.print()}
        >
          Print Invoice
        </Button>
      </div>
    </>
  );
};

export default Invoice;
