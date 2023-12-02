import { RegisteringComment } from "@/interfaces/comments/IComment";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import CommentModel from "@/schemas/CommentSchema";
import ReviewModel from "@/schemas/ReviewSchema";
import UserModel from "@/schemas/UserSchema";
import { faker } from "@faker-js/faker";

export default class CommentsSeeder implements ISeeder {
  private defaultCount = 20;
  private randomComments = [
    "Wow, this movie blew my mind! The plot twists were insane.",
    "I laughed so hard during this film, my cheeks hurt!",
    "The cinematography in this movie was absolutely stunning.",
    "This movie had me on the edge of my seat the whole time.",
    "The chemistry between the actors was off the charts!",
    "I couldn't stop talking about this movie for days.",
    "The soundtrack was so catchy, I've been listening to it on repeat.",
    "I loved how this film tackled important social issues.",
    "The visual effects were mind-blowing. It felt so real!",
    "I'm officially obsessed with the costumes in this movie.",
    "This film had the perfect balance of action and emotion.",
    "The ending left me with chills. I didn't see it coming!",
    "I connected with the characters on a deep, emotional level.",
    "The dialogue was sharp and witty. I couldn't stop quoting it.",
    "I've never cried so much during a movie. It was so touching.",
    "This movie had such a unique and original storyline.",
    "The pacing was perfect. It kept me engaged from start to finish.",
    "The performances in this film were award-worthy. Bravo!",
    "I was completely immersed in the world of this movie. So immersive!",
    "I walked out of the theater with a big smile on my face. Pure joy!",
  ];

  constructor() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Seeder shouldn't run on production");
    }
  }

  async generateComments(count: number): Promise<RegisteringComment[]> {
    // 1. Get users from the database
    const users = await UserModel.find();

    if (users.length === 0) {
      throw new Error(
        `Please seed users to create comments with their data 🙄`
      );
    }

    // 2. Get reviews from the database
    const reviews = await ReviewModel.find();

    if (reviews.length === 0) {
      throw new Error(
        `Please seed reviews to create comments with their data 🙄`
      );
    }

    // 3. Generate comments
    const comments: RegisteringComment[] = [];

    for (let i = 0; i < count; i++) {
      comments.push({
        text: faker.helpers.arrayElement(this.randomComments),
        userId: faker.helpers.arrayElement(users)._id,
        reviewId: faker.helpers.arrayElement(reviews)._id,
        parentId: null,
      });
    }

    return comments;
  }

  async seed(count = this.defaultCount): Promise<void> {
    const comments = await this.generateComments(count);

    try {
      await CommentModel.create(comments);
      console.log("Seeded comments data 🚀");
    } catch (error) {
      console.error(error);
    }
  }

  async unseed(): Promise<void> {
    try {
      await CommentModel.deleteMany();
      console.log("Deleted comments data 😔");
    } catch (error) {
      console.error(error);
    }
  }
}
