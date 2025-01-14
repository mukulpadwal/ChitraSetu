/* eslint-disable no-var */
import { Connection } from "mongoose";
import { DefaultSession } from "next-auth";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: mongoose.Types.ObjectId;
      email: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    id: mongoose.Types.ObjectId;
    email: string;
    role: "admin" | "user";
  }
}

export {};
