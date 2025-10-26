import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

// 🧠 Global caching so the DB connection persists across hot reloads or serverless calls
let cached = (global).mongoose;

if (!cached) {
  cached = (global).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    // ✅ If already connected, return the existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    // 🔄 Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "nextjs_mern_app", // optional
      bufferCommands: false,     // avoid command buffering
    }).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
