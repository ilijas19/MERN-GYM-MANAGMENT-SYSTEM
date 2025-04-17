import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (e) {
          return validator.isEmail(e);
        },
        message: (prop) => `${prop.value} is not a valid email`,
      },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Staff", "Trainer", "Member"],
      default: "Member",
    },
    membershipExpDate: {
      type: Date,
      default: Date.now(),
    },
    trainer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    clients: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    note: {
      type: String,
      maxLength: 64,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    package: {
      type: mongoose.Types.ObjectId,
      ref: "Package",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    let isUnique = false;
    let newId;

    while (!isUnique) {
      newId = Math.floor(10000 + Math.random() * 90000).toString();
      const existingUser = await mongoose
        .model("User")
        .findOne({ userId: newId });
      if (!existingUser) isUnique = true;
    }

    this.userId = newId;

    if (!this.password) {
      this.password = this.userId;
    }
  }

  if (
    this.isModified("password") &&
    this.password &&
    !this.password.startsWith("$2a$")
  ) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.role === "Trainer" && this.trainer) {
    return next(new Error("A Trainer cannot have a trainer assigned."));
  }

  if (this.role === "Member" && this.clients && this.clients.length > 0) {
    return next(new Error("A Member cannot have clients."));
  }

  next();
});

const User = mongoose.model("User", userSchema);
export default User;
