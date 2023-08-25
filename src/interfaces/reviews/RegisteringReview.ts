import { Types } from "mongoose";
import { IMovie } from "../movies/IMovie";

export interface RegisteringReview {
  userId: Types.ObjectId;
  userDetails: {
    displayName: string;
    avatar: string;
  };
  movieDetails: IMovie;
  rating: number;
  review: string;
}
