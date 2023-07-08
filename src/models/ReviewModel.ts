import { IReview } from "@/interfaces/reviews/IReview";
import { Schema, model } from "mongoose";

const ReviewSchema = new Schema<IReview>(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      ref: "User",
    },
    userDetails: {
      displayName: {
        type: String,
        required: [true, "Please add a username"],
      },
      avatar: {
        type: String,
        required: [true, "Please add an avatar"],
      },
    },
    movieDetails: {
      tmdbId: {
        type: String,
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
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
    },
    review: {
      type: String,
      default: "",
    },
    likers: {
      type: [String],
      default: [],
    },
    savers: {
      type: [String],
      default: [],
    },
    sharers: {
      type: [String],
      default: [],
    },
    comments: {
      type: Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = model<IReview>("Review", ReviewSchema);

export default ReviewModel;
