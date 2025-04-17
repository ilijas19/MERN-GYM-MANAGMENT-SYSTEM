import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import CustomError from "../errors/errorIndex.js";

export const getAllClients = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findOne({ userId: req.user.userId }).populate({
    path: "clients",
    select: "-password -__v",
    populate: {
      path: "package",
      select: "name",
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const totalClients = user.clients.length;
  const totalPages = Math.ceil(totalClients / limit);

  const startIndex = (page - 1) * limit;
  const clients = user.clients.slice(startIndex, startIndex + Number(limit));

  const nextPage = page < totalPages ? Number(page) + 1 : null;

  return res.status(200).json({
    clients,
    page,
    limit,
    totalClients,
    totalPages,
    nextPage,
  });
};

export const addClient = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({
    userId: memberId,
    role: "Member",
  }).select("trainer");
  if (!member) {
    throw new CustomError.NotFoundError("No Member With Specified Id");
  }
  const trainer = await User.findOne({ _id: req.user._id }).select("clients");
  if (!trainer) {
    throw new CustomError.UnauthenticatedError("Authetication Error");
  }
  const alreadyClient = trainer.clients.some(
    (client) => client.toString() === member._id.toString()
  );
  if (alreadyClient) {
    throw new CustomError.BadRequestError("Already Your Client");
  }
  const hasTrainer = member.trainer;
  if (hasTrainer) {
    throw new CustomError.BadRequestError("Client has trainer already");
  }
  trainer.clients.push(member._id);
  member.trainer = trainer._id;
  await trainer.save();
  await member.save();
  res.status(StatusCodes.OK).json({ msg: "Client Added" });
};

export const removeClient = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({
    userId: memberId,
    trainer: req.user._id,
    role: "Member",
  });
  if (!member) {
    throw new CustomError.NotFoundError(
      "No member with specified Id in your client list"
    );
  }
  const trainer = await User.findOne({ userId: req.user.userId });
  if (!trainer) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }
  member.trainer = null;
  trainer.clients = trainer.clients.filter(
    (client) => client.toString() !== member._id.toString()
  );
  await member.save();
  await trainer.save();

  res.status(StatusCodes.OK).json({ msg: "Client Removed" });
};
