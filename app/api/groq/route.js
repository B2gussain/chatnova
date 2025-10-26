import Groq from "groq-sdk";
import connectDB from "@/app/lib/connectDB";
import User from "@/app/models/User";
import Chat from "@/app/models/Chat";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
  }

  await connectDB();

  try {
    const { prompt } = await req.json();
    const username = req.headers.get("username");
    const email = req.headers.get("email");

    // Call Groq AI API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "";

    // Only store if both username and email exist
    if (username && email) {
      // Search for user
      let user = await User.findOne({ email });
      if (!user) {
        // Create new user if not found
        user = await User.create({ name: username, email, chats: [] });
      }

      // Find or create chat for this user
      let chat = await Chat.findOne({ user: user._id });
      if (!chat) {
        chat = await Chat.create({ user: user._id, messages: [] });
        user.chats.push(chat._id);
        await user.save();
      }

      // Save the messages
      chat.messages.push({ role: "user", content: prompt });
      chat.messages.push({ role: "assistant", content: aiMessage });
      await chat.save();
    }

    // Always return AI response to frontend
    return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });

  } catch (err) {
    console.error("Groq API error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch from Groq" }), { status: 500 });
  }
}
