export interface IMovie {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  summary: string;
  tmdbRating: number;
  director: {
    tmdbId: number;
    name: string;
    tmdbCreditId: string;
  };
}
