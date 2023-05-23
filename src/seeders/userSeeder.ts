import { faker } from "@faker-js/faker";
import User, { IUser } from "@/models/User";
import { ISeeder } from "@/interfaces/seeder/Seeder";

class UserSeeder implements ISeeder {
  private count: number;

  constructor(count = 20) {
    this.count = count;
  }

  private generateUsers(): IUser[] {
    const users: IUser[] = [];

    for (let i = 0; i < this.count; i++) {
      const user: IUser = {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      users.push(user);
    }

    return users;
  }

  async seed(): Promise<void> {
    const users = this.generateUsers();

    try {
      await User.create(users);
      console.log("Seeded users data 🚀");
    } catch (error) {
      console.error(error);
    }
  }

  async unseed(): Promise<void> {
    try {
      await User.deleteMany();
      console.log("Deleted users data 😔");
      process.exit();
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserSeeder;
