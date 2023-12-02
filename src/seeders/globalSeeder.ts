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
class GlobalSeeder implements ISeeder {
  private usersSeeder = new UsersSeeder();
  private reviewsSeeder = new ReviewsSeeder();
  private commentsSeeder = new CommentsSeeder(40);

  async seed(): Promise<void> {
    await this.usersSeeder.seed();
    await this.reviewsSeeder.seed();
    await this.commentsSeeder.seed();
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
