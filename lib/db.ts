import { DB_NAME } from "@/constants";
import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Check your database connection string...");
}

MONGODB_URI += `/${DB_NAME}`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    console.info("Already connected to Database...");
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(`${MONGODB_URI}`, options).then(() => {
      console.info("Successfully connected to Database...");
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Error while connection to mongodb ", error);
  }

  return cached.conn;
}
