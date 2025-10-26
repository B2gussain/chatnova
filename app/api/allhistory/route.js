import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDB";
import User from "@/app/models/User";
import Chat from "@/app/models/Chat";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get user identifier from query params or headers
    const url = new URL(req.url);
    const email = url.searchParams.get("email"); // e.g., /api/chats?email=test@example.com

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).populate({
      path: "chats",
      select: "messages createdAt updatedAt", // only return these fields
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Return all chat history
    return new Response(
      JSON.stringify({ chats: user.chats }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching chat history:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history" }),
      { status: 500 }
    );
  }
}
