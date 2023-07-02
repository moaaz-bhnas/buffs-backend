import { IMovie } from "../movies/IMovie";

export interface RegisteringReview {
  username: string;
  userDetails: {
    displayName: string;
    avatar: string;
  };
  movieDetails: IMovie;
  rating: number;
  review: string;
}
