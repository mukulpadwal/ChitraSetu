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

const Invoice = ({ order }: { order: IOrder }) => {
  const {
    amount,
    razorpayPaymentId,
    status,
    variant: { type, price, license, imageUrl },
    createdAt,
  } = order;

  const { email } = order.placedBy as PopulatedUser;
  const { name, description } = order.product as PopulatedProduct;

  return (
    <div className="flex flex-col p-6 gap-6 max-w-3xl mx-auto bg-white rounded-lg shadow-xl">
      {/* Invoice Title and Status */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-gray-800">Invoice</h1>
        <Badge
          variant={
            status === "completed"
              ? "outline"
              : status === "failed"
              ? "destructive"
              : status === "refunded"
              ? "secondary" // Replaced "info" with "secondary"
              : "default"
          }
          className="text-lg"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      {/* Order Details */}
      <Card className="shadow-lg rounded-xl">
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
            <p>{email}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Date:</p>
            <p>{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Product Details */}
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Information about the purchased product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Avatar>
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="font-medium text-xl text-gray-800">{name}</p>
              <p className="text-sm text-gray-600">{description}</p>
              <p className="text-sm font-medium text-gray-700">
                License: {license}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Variant:</p>
            <p>{type}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="font-medium">Price:</p>
            <p className="font-semibold">{price} INR</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Payment Summary */}
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Summary of the total payment made.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="font-medium">Total Amount:</p>
            <p className="font-semibold">{amount / 100} INR</p>
          </div>
        </CardContent>
      </Card>

      {/* Print Button */}
      <Button
        variant="default"
        className="w-full mt-4"
        onClick={() => window.print()}
      >
        Print Invoice
      </Button>
    </div>
  );
};

export default Invoice;
