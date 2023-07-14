import { IDirector } from "./IDirector";

export interface IMovie {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  summary: string;
  tmdbRating: number;
  director?: IDirector;
}
