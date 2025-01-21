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
import { Aperture, Printer } from "lucide-react";

const Invoice = ({ order }: { order: IOrder }) => {
  const {
    amount,
    razorpayPaymentId,
    status,
    variant: { type, price, previewUrl },
    createdAt,
  } = order;

  const { email } = (order?.placedBy as PopulatedUser) || {};
  const { name, description, license } =
    (order?.product as PopulatedProduct) || {};
  console.log(license);

  return (
    <>
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
        <div className="flex flex-col gap-2 sm:flex-row items-center justify-between">
          <div className="flex items-center justify-center">
            <Aperture className=" text-gray-800 mr-2" />
            <h1 className="text-xl sm:text-4xl font-semibold text-gray-800">
              SnapTrade
            </h1>
          </div>
          <Badge
            style={{
              backgroundColor:
                status === "completed"
                  ? "green"
                  : status === "failed"
                    ? "red"
                    : status === "refunded"
                      ? "purple"
                      : "yellow",
            }}
            className="text-base sm:text-lg"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800">Invoice</h2>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Details of the order placed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="font-bold">Order ID:</p>
                <p className="font-normal text-sm sm:text-base">
                  {razorpayPaymentId}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="font-bold">Placed By:</p>
                <p className="font-normal  text-sm sm:text-base">
                  {email || "N/A"}
                </p>{" "}
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="font-bold">Date:</p>
                <p className="font-normal text-sm sm:text-base">
                  {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="w-full shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Information about the purchased product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex flex-col gap-2">
              <Avatar>
                <AvatarImage src={previewUrl} alt={name || "Product"} />
                <AvatarFallback>{name ? name.charAt(0) : "P"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium text-xl">
                  {name || "Unknown Product"}
                </p>
                <p className="text-sm line-clamp-1 sm:line-clamp-none">
                  {description || "No description available."}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">License:</p>
                <p className="font-normal text-sm sm:text-base">
                  {license || "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">Variant:</p>
                <p className="font-normal text-sm sm:text-base">
                  {type || "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">Price:</p>
                <p className="font-normal text-sm sm:text-base">
                  {price || 0} INR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="w-full shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Summary of the total payment made.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <p className="font-bold">Total Amount:</p>
              <p className="font-normal text-sm sm:text-base">
                {amount / 100 || 0} INR
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Button
          variant="default"
          className="w-full flex justify-center items-center"
          onClick={() => window.print()}
        >
          <Printer />
          Print Invoice
        </Button>
      </div>
    </>
  );
};

export default Invoice;
