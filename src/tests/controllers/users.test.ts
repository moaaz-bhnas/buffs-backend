import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import UserSeeder from "@/seeders/userSeeder";
import UserModel from "@/models/User";

const userSeeder = new UserSeeder();

// @desc      Get all Users
describe("GET /api/v1/users", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.statusCode).to.equal(200);
  });
});

// @desc      Get a single user
describe("GET /api/v1/users/:id", () => {
  let userId = "";

  before(async () => {
    const user = await UserModel.create(userSeeder.generateUser());
    userId = user._id.toString();
  });

  after(async () => {
    await UserModel.deleteOne({ _id: userId });
  });

  describe("document exists", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).get(`/api/v1/users/${userId}`);
      expect(response.statusCode).to.equal(200);
    });
  });

  describe("document doesn't exist", () => {
    const nonExistentId = userId + "1";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${nonExistentId}`
      );
      expect(response.statusCode).to.equal(404);
    });
  });
});
