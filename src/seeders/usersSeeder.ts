import { faker } from "@faker-js/faker";
import User from "@/models/UserModel";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import { UserRole } from "@/interfaces/user/UserRole";
import { RegisteringUser } from "@/interfaces/user/RegisteringUser";

class UsersSeeder implements ISeeder {
  private count: number;

  constructor(count = 20) {
    this.count = count;
  }

  generateUser(): RegisteringUser {
    const user: RegisteringUser = {
      username: faker.internet.userName(),
      displayName: faker.internet.displayName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.user,
    };
    return user;
  }

  generateUsers(count = this.count): RegisteringUser[] {
    const users: RegisteringUser[] = [];

    for (let i = 0; i < count; i++) {
      const user: RegisteringUser = this.generateUser();

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
    } catch (error) {
      console.error(error);
    }
  }
}

export default UsersSeeder;
