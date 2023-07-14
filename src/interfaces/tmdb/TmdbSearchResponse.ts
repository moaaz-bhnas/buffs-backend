import { TmdbDemoMovie } from "./TmdbDemoMovie";

export interface TmdbSearchResponse {
  page: number;
  results: TmdbDemoMovie[];
  total_results: number;
  total_pages: number;
}
