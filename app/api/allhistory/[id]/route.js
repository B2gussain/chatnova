import connectDB from "../../../lib/connectDB";
import Chat from "../../../models/Chat";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const chat = await Chat.findById(id);

    if (!chat) {
      return new Response(
        JSON.stringify({ error: "Chat not found" }),
        { status: 404 }
      );
    }

    // ✅ Return messages + timestamps
    return new Response(
      JSON.stringify({
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const deletedChat = await Chat.findByIdAndDelete(id);

    if (!deletedChat) {
      return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Chat deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete chat" }), { status: 500 });
  }
}