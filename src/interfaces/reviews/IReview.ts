import { IMovie } from "../movies/IMovie";

export interface IReview {
  username: string;
  userDetails: {
    displayName: string;
    avatar: string;
  };
  movieDetails: IMovie;
  rating: number;
  review: string;
  /**
   * Array of usernames who liked the review
   */
  likers: string[];
  /**
   * Array of usernames who saved the review
   */
  savers: string[];
  /**
   * Array of usernames who shared the review
   */
  sharers: string[];
  /**
   * TODO: needs to be updated with the comment schema
   */
  comments: any[];
}
