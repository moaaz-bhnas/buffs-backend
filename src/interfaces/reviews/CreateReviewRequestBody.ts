import { IMovie } from "../movies/IMovie";

export interface CreateReviewRequestBody {
  movieDetails: IMovie;
  rating: number;
  review: string;
}
