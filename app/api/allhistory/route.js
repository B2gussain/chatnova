import connectDB from "../../lib/connectDB";
import User from "../../models/User";
import Chat from "../../models/Chat";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Find user and populate chats
    const user = await User.findOne({ email }).populate("chats");

    if (!user) {
      return new Response(
        JSON.stringify({ chats: [] }), 
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Return chats (sorted by createdAt descending - newest first)
    const chats = user.chats || [];
    
    return new Response(
      JSON.stringify({ chats }), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error.message 
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Chat ID required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Find the chat first to verify it exists
    const chat = await Chat.findById(id);
    if (!chat) {
      return new Response(
        JSON.stringify({ error: "Chat not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Remove chat reference from all users who have it
    await User.updateMany(
      { chats: id },
      { $pull: { chats: id } }
    );

    // Delete the chat document
    await Chat.findByIdAndDelete(id);

    console.log(`✅ Chat ${id} deleted successfully`);

    return new Response(
      JSON.stringify({ 
        message: "Chat deleted successfully",
        deletedId: id 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error.message 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}