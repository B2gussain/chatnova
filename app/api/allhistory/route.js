import connectDB from "../../lib/connectDB";
import User from "../../models/User";
import Chat from "../../models/Chat";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  }

  const user = await User.findOne({ email }).populate("chats");

  if (!user) {
    return new Response(JSON.stringify({ chats: [] }), { status: 200 });
  }

  return new Response(
    JSON.stringify({ chats: user.chats }),
    { status: 200 }
  );
}
