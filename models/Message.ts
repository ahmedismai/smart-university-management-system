import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
