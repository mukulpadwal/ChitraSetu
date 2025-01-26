import { Resend } from "resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import OrderFailureEmail from "@/emails/OrderFailureEmail";
import OrderRefundEmail from "@/emails/OrderRefundEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail({
  email,
  createdAt,
  razorpayPaymentId,
  orderId,
  previewUrl,
  name,
  description,
  amount,
  downloadUrl,
}: {
  email: string;
  createdAt: Date;
  razorpayPaymentId: string;
  orderId: string;
  previewUrl: string;
  name: string;
  description: string;
  amount: number;
  downloadUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "team-chitra-setu@mukulpadwal.me",
      to: [email],
      subject: "Order Completed ✔",
      react: OrderConfirmationEmail({
        email,
        createdAt,
        razorpayPaymentId,
        orderId,
        previewUrl,
        name,
        description,
        amount,
        downloadUrl,
      }) as React.ReactElement,
    });

    if (error) {
      console.error(error);
    }

    return data?.id;
  } catch (error) {
    console.error(error);
  }
}

export async function sendFailureEmail({
  email,
  createdAt,
  razorpayPaymentId,
  orderId,
  previewUrl,
  name,
  description,
  amount,
}: {
  email: string;
  createdAt: Date;
  razorpayPaymentId: string;
  orderId: string;
  previewUrl: string;
  name: string;
  description: string;
  amount: number;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "team-chitra-setu@mukulpadwal.me",
      to: [email],
      subject: "Order Failed ❌",
      react: OrderFailureEmail({
        email,
        createdAt,
        razorpayPaymentId,
        orderId,
        previewUrl,
        name,
        description,
        amount,
      }) as React.ReactElement,
    });

    if (error) {
      console.error(error);
    }

    return data?.id;
  } catch (error) {
    console.error(error);
  }
}

export async function sendRefundEmail({
  email,
  createdAt,
  razorpayPaymentId,
  orderId,
  previewUrl,
  name,
  description,
  amount,
}: {
  email: string;
  createdAt: Date;
  razorpayPaymentId: string;
  orderId: string;
  previewUrl: string;
  name: string;
  description: string;
  amount: number;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "team-chitra-setu@mukulpadwal.me",
      to: [email],
      subject: "Order Refund Initiated 🔄",
      react: OrderRefundEmail({
        email,
        createdAt,
        razorpayPaymentId,
        orderId,
        previewUrl,
        name,
        description,
        amount,
      }) as React.ReactElement,
    });

    if (error) {
      console.error(error);
    }

    return data?.id;
  } catch (error) {
    console.error(error);
  }
}

export default resend;
