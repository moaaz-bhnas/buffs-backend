import { IComment } from "@/interfaces/comments/IComment";
import { Schema, model } from "mongoose";

export const CommentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, "Please add the comment's text"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add the user ID"],
      ref: "User",
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add the review ID"],
      ref: "Review",
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = model<IComment>("Comment", CommentSchema);

export default CommentModel;
