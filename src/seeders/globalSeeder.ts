import { ISeeder } from "@/interfaces/seeder/Seeder";
import UsersSeeder from "./usersSeeder";
import connectDB from "@/db";
import { Command } from "@/interfaces/seeder/Command";
import ReviewsSeeder from "./reviewsSeeder";
import CommentsSeeder from "./commentsSeeder";

/**
 * Seeds users and reviews data to the database for testing
 * ONLY USE IT IN DEVELOPMENT MODE
 */
export default class GlobalSeeder implements ISeeder {
  private usersSeeder = new UsersSeeder();
  private reviewsSeeder = new ReviewsSeeder();
  private commentsSeeder = new CommentsSeeder();

  constructor() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Seeder shouldn't run on production");
    }
  }

  async seed(
    { users, reviews, comments } = { users: 20, reviews: 20, comments: 20 }
  ): Promise<void> {
    await this.usersSeeder.seed(users);
    await this.reviewsSeeder.seed(reviews);
    await this.commentsSeeder.seed(comments);
  }

  async unseed(): Promise<void> {
    await this.usersSeeder.unseed();
    await this.reviewsSeeder.unseed();
    await this.commentsSeeder.unseed();
  }

  async run(): Promise<void> {
    await connectDB();

    const command = process.argv[2] as Command;

    if (!command) {
      throw new Error(
        "Please add an argument i (import) / d (delete) to the command."
      );
    }

    switch (command) {
      case Command.import:
        await this.seed();
        process.exit();
      case Command.delete:
        await this.unseed();
        process.exit();
    }
  }
}

const globalSeeder = new GlobalSeeder();
globalSeeder.run();
