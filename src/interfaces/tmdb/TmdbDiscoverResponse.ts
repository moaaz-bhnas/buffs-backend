import { TmdbDemoMovie } from "./TmdbDemoMovie";

export interface MoviesApiDiscoverResponse {
  page: number;
  results: TmdbDemoMovie[];
  total_results: number;
  total_pages: number;
}
