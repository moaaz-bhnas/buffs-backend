import { TmdbMovie } from "./TmdbMovie";

export interface MoviesApiDiscoverResponse {
  page: number;
  results: TmdbMovie[];
  total_results: number;
  total_pages: number;
}
