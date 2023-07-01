import { IReview } from "@/interfaces/reviews/IReview";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import { IUser } from "@/interfaces/user/IUser";
import ReviewModel from "@/models/ReviewModel";
import UserModel from "@/models/UserModel";
import { faker } from "@faker-js/faker";

class ReviewsSeeder implements ISeeder {
  private count: number;

  constructor(count = 20) {
    this.count = count;
  }

  generateReview(user: IUser, friends: IUser[]): IReview {
    const friendsUsernames = friends.map((friend) => friend.username);

    const review: IReview = {
      username: user.username,
      userDetails: {
        displayName: user.displayName,
        avatar: user.avatar || "",
      },
      movieDetails: {
        tmdbId: 767,
        title: "Harry Potter and the Half-Blood Prince",
        posterPath: "/z7uo9zmQdQwU5ZJHFpv2Upl30i1.jpg",
        releaseDate: "2009-07-07",
        genres: ["Adventure", "Fantasy"],
        summary:
          "As Lord Voldemort tightens his grip on both the Muggle and wizarding worlds, Hogwarts is no longer a safe haven. Harry suspects perils may even lie within the castle, but Dumbledore is more intent upon preparing him for the final battle fast approaching. Together they work to find the key to unlock Voldemorts defenses and to this end, Dumbledore recruits his old friend and colleague Horace Slughorn, whom he believes holds crucial information. Even as the decisive showdown looms, romance blossoms for Harry, Ron, Hermione and their classmates. Love is in the air, but danger lies ahead and Hogwarts may never be the same again.",
        tmdbRating: 7.7,
        director: "David Yates",
      },
      rating: 9,
      review: "Awesome!",
      likers: friendsUsernames,
      savers: friendsUsernames,
      sharers: friendsUsernames,
      comments: [],
    };

    return review;
  }

  async generateReviews(count = this.count): Promise<IReview[]> {
    const users = await UserModel.find().limit(count);

    if (users.length < count) {
      throw new Error(
        `Please make sure number of users in the database is >= ${count}`
      );
    }

    const reviews: IReview[] = [];

    for (let i = 0; i < count; i++) {
      const friends = faker.helpers.arrayElements(users, {
        min: 1,
        max: count,
      });
      const review = this.generateReview(users[i], friends);
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
      process.exit();
    } catch (error) {
      console.error(error);
    }
  }
}

export default ReviewsSeeder;
