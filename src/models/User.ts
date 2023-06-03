import { Model, model, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "@/interfaces/user/IUser";
import { IUserMethods } from "@/interfaces/user/IUserMethods";
import emailRegex from "@/utils/regex/emailRegex";

export interface IUserModel extends Model<IUser, {}, IUserMethods> {}

const UserSchema = new Schema<IUser, IUserModel>({
  username: {
    type: String,
    required: [true, "Please add a username"],
    unique: true,
  },
  displayName: {
    type: String,
    required: [true, "Please add a display name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [emailRegex, "Please add a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt password using bcrypt
UserSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

/* 
فايدة التوكن انها بتتبعت مع اي ريكويست بعد تسجيل الدخول
for authentication
*/

UserSchema.methods.getSignedJwtToken = function (): string {
  // "this" here refers to the instance (document)
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET ?? "", {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const match = await bcrypt.compare(enteredPassword, this.password);
  return match;
};

/** A great article to read: https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/
  - Buffer, data streams, binary data
 */

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 60 * 1000;

  return resetToken;
};

const UserModel = model<IUser, IUserModel>("User", UserSchema);

export default UserModel;
