import mongoose from "mongoose";
import Message from "../models/Message.js";

const chatSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

chatSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Message.deleteMany({ chatId: this._id });
  }
);

export default mongoose.model("Chat", chatSchema);
