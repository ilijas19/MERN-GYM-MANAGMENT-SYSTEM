import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/errorIndex.js";
import Package from "../models/Package.js";
import PackagePayment from "../models/PackagePayment.js";

export const registerMember = async (req, res) => {
  const { fullName, email, gymPackage } = req.body;

  if (!fullName || !email || !gymPackage) {
    throw new CustomError.BadRequestError(
      "Full Name, Email, and Gym Package are required"
    );
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email is already registered");
  }

  const existingPackage = await Package.findById(gymPackage);
  if (!existingPackage) {
    throw new CustomError.NotFoundError("Package not found");
  }
  if (!existingPackage.isActive) {
    throw new CustomError.BadRequestError("Package is not active");
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + existingPackage.duration);

  const member = await User.create({
    fullName,
    email: normalizedEmail,
    package: gymPackage,
    membershipExpDate: expirationDate,
  });
  // CREATING PAYMENT
  await PackagePayment.create({
    member: member._id,
    package: gymPackage,
    price: existingPackage.price,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Member registered successfully",
    fullName,
    email,
    userId: member.userId,
  });
};

export const checkMembership = async (req, res) => {
  const { id: memberId } = req.body;

  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }

  const member = await User.findOne({ userId: memberId })
    .populate({
      path: "package",
      select: "name",
    })
    .select("-password -__v");

  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }

  if (member.role !== "Member") {
    throw new CustomError.BadRequestError("You can only check members");
  }

  if (!member.package) {
    throw new CustomError.BadRequestError("Member Has No Package");
  }

  const membershipExpDate = new Date(member.membershipExpDate);
  const currentDate = new Date();
  const isMembershipActive = membershipExpDate > currentDate;
  res.status(StatusCodes.OK).json({
    member: member,
    isActive: isMembershipActive,
    membershipExpDate: membershipExpDate.toISOString().split("T")[0],
    package: member.package,
    msg: isMembershipActive
      ? `Membership is active till ${
          membershipExpDate.toISOString().split("T")[0]
        }`
      : `Membership expired on ${
          membershipExpDate.toISOString().split("T")[0]
        }`,
  });
};

export const renewMembership = async (req, res) => {
  const { id: memberId } = req.params;
  const { gymPackage } = req.body;

  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  if (!gymPackage) {
    throw new CustomError.BadRequestError("Package must be provided");
  }

  const member = await User.findOne({ userId: memberId }).populate("package");

  if (!member) {
    throw new CustomError.NotFoundError("Member not found");
  }

  const existingPackage = await Package.findById(gymPackage);
  if (!existingPackage) {
    throw new CustomError.NotFoundError(
      "No active package found with specified ID"
    );
  }

  const durationDays = existingPackage.duration;
  if (!durationDays || durationDays <= 0) {
    throw new CustomError.BadRequestError("Invalid package duration");
  }

  const currentDate = new Date();
  const newExpirationDate = new Date();
  newExpirationDate.setDate(currentDate.getDate() + durationDays);

  member.membershipExpDate = newExpirationDate;
  member.package = gymPackage;

  await member.save();

  // CREATING PAYMENT
  await PackagePayment.create({
    member: member._id,
    package: gymPackage,
    price: existingPackage.price,
  });

  res.status(StatusCodes.OK).json({
    msg: "Membership renewed successfully",
    newExpirationDate: member.membershipExpDate.toISOString().split("T")[0],
    package: existingPackage.name,
  });
};

export const addNote = async (req, res) => {
  const { id: memberId } = req.params;
  const { note } = req.body;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  if (!note) {
    throw new CustomError.BadRequestError("Note must be provided");
  }
  const member = await User.findOne({ userId: memberId });
  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }
  if (member.role !== "Member") {
    throw new CustomError.UnauthorizedError("You can only search for members");
  }
  member.note = note;
  await member.save();
  res.status(StatusCodes.OK).json({ msg: "Note Created" });
};

export const clearNote = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({ userId: memberId });
  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }
  if (member.role !== "Member") {
    throw new CustomError.UnauthorizedError("You can only search for members");
  }
  member.note = "";
  await member.save();
  res.status(StatusCodes.OK).json({ msg: "Note Cleared" });
};

export const getAllMembers = async (req, res) => {
  const { page = 1, fullName, gymPackage, active } = req.query;
  const queryObject = { role: "Member" };
  const limit = 10;

  if (fullName) queryObject.fullName = { $regex: fullName, $options: "i" };
  if (gymPackage) queryObject.package = gymPackage;

  const allFilteredUsers = await User.find(queryObject)
    .select("-password -__v")
    .populate({ path: "package", select: "name" })
    .sort("-createdAt")
    .lean();

  const currentDate = new Date();
  const usersWithActive = allFilteredUsers.map((user) => ({
    ...user,
    active: user.membershipExpDate
      ? new Date(user.membershipExpDate) > currentDate
      : false,
  }));

  let finalUsers = usersWithActive;
  if (active === "true") {
    finalUsers = usersWithActive.filter((user) => user.active === true);
  } else if (active === "false") {
    finalUsers = usersWithActive.filter((user) => user.active === false);
  }

  const totalUsers = finalUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (page - 1) * limit;
  const paginatedUsers = finalUsers.slice(startIndex, startIndex + limit);
  const nextPage = page < totalPages ? Number(page) + 1 : null;

  return res.status(200).json({
    page: Number(page),
    limit: Number(limit),
    totalUsers,
    totalPages,
    nextPage,
    users: paginatedUsers,
  });
};

export const getSingleMember = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({ userId: memberId })
    .lean()
    .select("-password -__v")
    .populate({
      path: "trainer",
      select: "fullName userId",
    })
    .populate({ path: "package", select: "name" });
  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }
  if (member.role !== "Member") {
    throw new CustomError.UnauthorizedError("You can only search for members");
  }

  res.status(StatusCodes.OK).json({ member });
};

export const updateMember = async (req, res) => {
  const { id: memberId } = req.params;
  const { fullName, email, note } = req.body;
  if (!memberId) {
    throw new CustomError.BadRequestError("memberId needs to be provided");
  }
  const member = await User.findOne({ userId: memberId, role: "Member" });
  if (!member) {
    throw new CustomError.NotFoundError("Member not found");
  }
  member.fullName = fullName || member.fullName;
  member.email = email || member.email;
  member.note = note || member.note;
  await member.save();
  res.status(StatusCodes.OK).json({ msg: "Info Updated" });
};

export const deleteMember = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("Member Id needs to be provided");
  }
  const member = await User.findOne({ userId: memberId, role: "Member" });
  if (!member) {
    throw new CustomError.NotFoundError("Member Not Found");
  }
  await member.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Member Deleted" });
};
