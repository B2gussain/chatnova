import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Hot reload safe
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
