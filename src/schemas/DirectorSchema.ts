import { IDirector } from "@/interfaces/movies/IDirector";
import { Schema } from "mongoose";

export const DirectorSchema = new Schema<IDirector>(
  {
    tmdbId: {
      type: Number,
      required: [true, "Please add a director tmdb id"],
    },
    name: {
      type: String,
      required: [true, "Please add a director name"],
    },
    tmdbCreditId: {
      type: String,
      required: [true, "Please add a director tmdb credit id"],
    },
  },
  { _id: false }
);
