import { TmdbApiClient } from "@/apis/tmdb-api-client";
import { IReview } from "@/interfaces/reviews/IReview";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import { TmdbDemoMovie } from "@/interfaces/tmdb/TmdbDemoMovie";
import { IUser } from "@/interfaces/user/IUser";
import ReviewModel from "@/schemas/ReviewSchema";
import UserModel from "@/schemas/UserSchema";
import { faker } from "@faker-js/faker";

interface UserReview {
  rating: number;
  text: string;
}

class ReviewsSeeder implements ISeeder {
  private count: number;
  private randomReviews = [
    { rating: 8.5, text: "Great movie, highly recommended!" },
    { rating: 9.2, text: "One of the best movies I've seen!" },
    { rating: 7.9, text: "Solid film, worth watching." },
    { rating: 6.5, text: "Decent movie, but nothing special." },
    { rating: 8.8, text: "Incredible performance by the lead actor." },
    { rating: 7.2, text: "Good movie, enjoyed it." },
    { rating: 9.7, text: "A masterpiece! Must-watch!" },
    { rating: 5.6, text: "Not my cup of tea, didn't like it." },
    { rating: 8.1, text: "Engaging storyline, kept me hooked." },
    { rating: 6.9, text: "Average movie, had its moments." },
    { rating: 7.8, text: "Well-directed with stunning visuals." },
    { rating: 9.5, text: "Absolutely loved it, a must-see!" },
    { rating: 6.3, text: "Fairly entertaining, but forgettable." },
    {
      rating: 8.6,
      text: "Captivating plot, couldn't take my eyes off the screen.",
    },
    { rating: 7.1, text: "Decent performances, but lacked depth." },
    { rating: 9.3, text: "Brilliant film, left me speechless." },
    { rating: 8.0, text: "Solid movie, would recommend it." },
    { rating: 7.4, text: "Enjoyable flick, good for a casual watch." },
    { rating: 7.7, text: "Well-paced and engaging." },
    { rating: 8.9, text: "Impressive cinematography, visually stunning." },
  ];

  constructor(count = 20) {
    this.count = count;
  }

  generateReview(
    user: IUser,
    friends: IUser[],
    movie: TmdbDemoMovie,
    userReview: UserReview
  ): IReview {
    const friendsUsernames = friends.map((friend) => friend.username);

    const review: IReview = {
      username: user.username,
      userDetails: {
        displayName: user.displayName,
        avatar: user.avatar || "",
      },
      movieDetails: {
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.complete_poster_path || "",
        releaseDate: movie.release_date,
        genres: movie.genres?.map((genre) => genre.name) || [],
        summary: movie.overview,
        tmdbRating: movie.vote_average,
      },
      rating: userReview.rating,
      review: userReview.text,
      likers: friendsUsernames,
      savers: friendsUsernames,
      sharers: friendsUsernames,
      comments: [],
    };

    if (movie.director) {
      review.movieDetails.director = {
        tmdbId: movie.director.id,
        name: movie.director.name,
        tmdbCreditId: movie.director.credit_id,
      };
    }

    return review;
  }

  async generateReviews(count = this.count): Promise<IReview[]> {
    // 1. Get users from the database
    const users = await UserModel.find().limit(count);

    if (users.length === 0) {
      throw new Error(`Please seed users to create reviews with their data 🙄`);
    }

    // 2. Get random movies
    const tmdbApiClient = new TmdbApiClient();
    const randomMoviesResult = await tmdbApiClient.getRandomMovies(count);

    if (randomMoviesResult.isErr()) {
      throw new Error(`Failed to get random ${count} movies.`);
    }

    // 3. Generate reviews
    const reviews: IReview[] = [];

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users);
      const movie = faker.helpers.arrayElement(randomMoviesResult.value);
      const friends = faker.helpers.arrayElements(users, {
        min: 1,
        max: users.length,
      });
      const userReview = faker.helpers.arrayElement(this.randomReviews);
      const review = this.generateReview(user, friends, movie, userReview);
      reviews.push(review);
    }

    return reviews;
  }

  async seed(): Promise<void> {
    const reviews = await this.generateReviews();

    try {
      await ReviewModel.create(reviews);
      console.log("Seeded reviews data 🚀");
    } catch (error) {
      console.error(error);
    }
  }

  async unseed(): Promise<void> {
    try {
      await ReviewModel.deleteMany();
      console.log("Deleted reviews data 😔");
    } catch (error) {
      console.error(error);
    }
  }
}

export default ReviewsSeeder;
