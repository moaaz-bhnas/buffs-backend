import { Types } from "mongoose";
import { IMovie } from "../movies/IMovie";

export interface IReview {
  userId: Types.ObjectId;
  userDetails: {
    username: string;
    displayName: string;
    avatar: string;
  };
  movieDetails: IMovie;
  rating: number;
  review: string;
  /**
   * Array of usernames who liked the review
   */
  likers: Types.ObjectId[];
  /**
   * Array of usernames who saved the review
   */
  savers: Types.ObjectId[];
  /**
   * Array of usernames who shared the review
   */
  sharers: Types.ObjectId[];
  /**
   * A flag to indicate whether the review author has deleted the review
   */
  isDeleted: boolean;
}
