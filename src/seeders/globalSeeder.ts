import { ISeeder } from "@/interfaces/seeder/Seeder";
import UsersSeeder from "./usersSeeder";
import connectDB from "@/db";
import { Command } from "@/interfaces/seeder/Command";
import ReviewsSeeder from "./reviewsSeeder";

class GlobalSeeder implements ISeeder {
  private usersSeeder = new UsersSeeder();
  private reviewsSeeder = new ReviewsSeeder();

  async seed(): Promise<void> {
    await this.usersSeeder.seed();
    await this.reviewsSeeder.seed();
  }

  async unseed(): Promise<void> {
    await this.usersSeeder.unseed();
    await this.reviewsSeeder.unseed();
  }

  async run(): Promise<void> {
    await connectDB();

    const command = process.argv[2] as Command;

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
