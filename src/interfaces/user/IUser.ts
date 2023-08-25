import { Schema, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  /**
   * Created by a Mongoose middleware before save
   */
  avatar: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt?: Date;
}
