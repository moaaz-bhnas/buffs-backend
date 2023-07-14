import { IMovie } from "@/interfaces/movies/IMovie";
import { Schema } from "mongoose";
import { DirectorSchema } from "./DirectorSchema";

export const MovieSchema = new Schema<IMovie>(
  {
    tmdbId: {
      type: Number,
      required: [true, "Please add the tmdbId"],
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    posterPath: {
      type: String,
      required: [true, "Please add a poster path"],
    },
    releaseDate: {
      type: String,
      required: [true, "Please add a release date"],
    },
    genres: {
      type: [String],
      required: [true, "Please add genres"],
    },
    summary: {
      type: String,
      required: [true, "Please add a summary"],
    },
    tmdbRating: {
      type: Number,
      required: [true, "Please add the tmdb rating"],
    },
    director: {
      type: DirectorSchema,
      default: null,
    },
  },
  { _id: false }
);
