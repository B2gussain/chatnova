import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { _id: false } // optional: don’t need separate _id for each message
);

const ChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
