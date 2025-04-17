import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const CreateMessage = async (message) => {
  try {
    const chat = await Chat.findOne({ _id: message.chat });
    if (!chat) {
      throw new CustomError.BadRequestError("Chat Not Found");
    }

    const msg = await Message.create({
      senderId: message.senderId,
      chatId: message.chat,
      text: message.text,
    });

    chat.messages.push(msg);
    chat.lastMessage = msg;
    await chat.save();
  } catch (error) {
    console.log(error);
  }
};

export const SetLastMessageSeen = async (req, res) => {
  res.send("Set Last Message Seen");
};
