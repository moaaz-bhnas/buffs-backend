import { Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
}

// To understand this: https://stackoverflow.com/a/69781853/7982963
interface InstanceMethods {
  getSignedJwtToken(): string;
  matchPassword(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser, {}, InstanceMethods> {}

const UserSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
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
UserSchema.pre("save", async function encryptPassword() {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

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

const UserModel = model<IUser, IUserModel>("User", UserSchema);

export default UserModel;
