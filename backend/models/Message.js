import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide sender id"],
      ref: "User",
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide chat id"],
      ref: "Chat",
    },
    text: {
      type: String,
      required: true,
      maxLength: 150,
    },
    status: {
      type: String,
      enum: ["sent", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
