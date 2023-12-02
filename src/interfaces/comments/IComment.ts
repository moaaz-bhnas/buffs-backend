import { Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  text: string;
  userId: Types.ObjectId;
  reviewId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisteringComment {
  text: string;
  userId: Types.ObjectId;
  reviewId: Types.ObjectId;
  parentId: Types.ObjectId | null;
}
