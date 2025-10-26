import Groq from "groq-sdk";
import mongoose from "mongoose";
import Chat from "../../models/Chat";
import User from "../../models/User";
import connectDB from "../../lib/connectDB";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  await connectDB();

  const username = req.headers.get("username");
  const email = req.headers.get("email");
  const { prompt, chatId } = await req.json();

  try {
    // 🧠 Get AI response
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "";

    // 🧑‍💻 If no email, don’t store anything
    if (!email) {
      return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });
    }

    // 🧠 Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: username || "Guest", email });
    }

    let chat;

    if (chatId) {
      // Append to existing chat
      chat = await Chat.findById(chatId);
    } else {
      // Create new chat session
      chat = await Chat.create({
        user: user._id,
        messages: [],
      });
      user.chats.push(chat._id);
      await user.save();
    }

    // Add messages
    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "assistant", content: aiMessage });
    await chat.save();

    return new Response(
      JSON.stringify({ message: aiMessage, chatId: chat._id }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Groq API error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch from Groq" }), { status: 500 });
  }
}
