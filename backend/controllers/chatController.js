import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/errorIndex.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const createChat = async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({
    userId: memberId,
    role: "Member",
  }).select("fullName userId _id trainer");
  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }

  const trainer = await User.findOne({
    userId: req.user.userId,
    role: "Trainer",
  }).select("fullName userId _id");
  if (!trainer) {
    throw new CustomError.UnauthenticatedError(
      "Only Trainers Can Create Conversations"
    );
  }

  if (member.trainer.toString() !== trainer._id.toString()) {
    throw new CustomError.BadRequestError("Member is not your client");
  }
  const existingChat = await Chat.findOne({
    memberId: member._id,
    trainerId: trainer._id,
  })
    .populate({
      path: "trainerId",
      select: "fullName userId profilePicture",
    })
    .populate({
      path: "memberId",
      select: "fullName userId profilePicture",
    });

  if (existingChat) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Opening Existing Chat", chat: existingChat });
  }
  const chat = await Chat.create({
    memberId: member._id,
    trainerId: trainer._id,
  });

  const chatToReturn = await Chat.findOne({ _id: chat._id })
    .populate({
      path: "trainerId",
      select: "fullName userId profilePicture",
    })
    .populate({
      path: "memberId",
      select: "fullName userId profilePicture",
    });

  res.status(StatusCodes.CREATED).json({
    msg: "Chat Created",
    chat: chatToReturn,
    trainer,
    member,
  });
};

export const getAllChats = async (req, res) => {
  const trainer = await User.findOne({
    userId: req.user.userId,
    role: "Trainer",
  });
  if (!trainer) {
    throw new CustomError.UnauthenticatedError(
      "Only Trainers Can Get Their Conversations"
    );
  }
  const chats = await Chat.find({ trainerId: trainer._id })
    .populate({
      path: "trainerId",
      select: "fullName userId profilePicture",
    })
    .populate({
      path: "memberId",
      select: "fullName userId profilePicture",
    })
    .populate({
      path: "lastMessage",
      populate: {
        path: "senderId",
        select: "fullName userId",
      },
    });
  res.status(StatusCodes.OK).json({ chats });
};

export const getChatMesssages = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("chatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId }).populate({
    path: "messages",
    populate: {
      path: "senderId",
      select: "fullName userId email",
    },
  });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat not found");
  }
  res.status(StatusCodes.OK).json({ messages: chat.messages });
};

export const deleteChat = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("chatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat not found");
  }
  await chat.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Chat Deleted" });
};

//for users to get chat and messages from their trainer
export const getTrainerChat = async (req, res) => {
  const member = await User.findOne({
    userId: req.user.userId,
    role: "Member",
  });

  if (!member) {
    throw new CustomError.NotFoundError("Member not found")();
  }
  if (!member.trainer) {
    throw new CustomError.BadRequestError("You Dont Have A Trainer");
  }

  const chat = await Chat.findOne({ memberId: member._id })
    .populate({
      path: "trainerId",
      select: "fullName userId profilePicture",
    })
    .populate({
      path: "memberId",
      select: "fullName userId profilePicture",
    });
  if (!chat) {
    throw new CustomError.BadRequestError("Trainer Closed This Chat");
  }
  res.status(StatusCodes.OK).json({ chat });
};
