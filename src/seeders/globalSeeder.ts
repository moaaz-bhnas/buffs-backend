import { ISeeder } from "@/interfaces/seeder/Seeder";
import UserSeeder from "./userSeeder";
import connectDB from "@/db";
import { Command } from "@/interfaces/seeder/Command";

class GlobalSeeder implements ISeeder {
  private usersSeeder = new UserSeeder();

  async seed(): Promise<void> {
    await this.usersSeeder.seed();
  }

  async unseed(): Promise<void> {
    await this.usersSeeder.unseed();
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
