import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
 
 
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URL, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("Database connected successfully");
        return mongoose;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  
  cached.conn = await cached.promise;
  return cached.conn;
}
