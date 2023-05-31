import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "@/server";
import UserModel from "@/models/User";
import { IUser } from "@/interfaces/user/IUser";
import UserSeeder from "@/seeders/userSeeder";
import { faker } from "@faker-js/faker";

const userSeeder = new UserSeeder();

async function addUserToDB(user: IUser) {
  await UserModel.create(user);
}

async function removeUserFromDB(username: string) {
  await UserModel.deleteOne({ username });
}

function generateUser() {
  const user: IUser = userSeeder.generateUsers(1)[0];
  return user;
}

const user = generateUser();

// @desc      Register user
describe("POST /api/v1/auth/register", () => {
  describe("Email is valid", () => {
    afterEach(async function () {
      await UserModel.deleteOne({
        username: user.username,
      });
    });

    it("should respond with a (201: created) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(user);
      expect(response.statusCode).to.equal(201);
    });
  });

  describe("Email is not valid", () => {
    const invalidUser: IUser = generateUser();
    invalidUser.email = "yuuri@yahoo";

    it("should respond with a (400: bad request) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidUser);
      expect(response.statusCode).to.equal(400);
    });
  });
});

// @desc      Login user
describe("POST /api/v1/auth/login", () => {
  const user = generateUser();

  before(async function () {
    await addUserToDB(user);
  });

  after(async function () {
    await removeUserFromDB(user.username);
  });

  describe("Email is valid", () => {
    const validCredentials = { email: user.email, password: user.password };

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(validCredentials);
      expect(response.statusCode).to.equal(200);
    });
  });

  describe("Email is not valid", () => {
    const invalidEmail = {
      email: "yurio@yahoo",
      password: user.password,
    };

    it("should respond with a (401: unauthorized) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(invalidEmail);
      expect(response.statusCode).to.equal(401);
    });
  });
});

// @desc      Logout user
describe("GET /api/v1/auth/logout", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get("/api/v1/auth/logout");
    expect(response.statusCode).to.equal(200);
  });
});

// @desc      Get logged-in user via token
describe("GET /api/v1/auth/me", () => {
  const user = generateUser();
  let token = "";

  // Runs before all tests
  before(async function getToken() {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);

    token = response.body.token;
  });

  after(async function () {
    await UserModel.deleteOne({ username: user.username });
  });

  describe("Token is valid", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).to.equal(200);
    });
  });

  describe("Token is invalid", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}1`);
      expect(response.statusCode).to.equal(401);
    });
  });
});

// @desc      Forgot password
describe("POST /api/v1/auth/forgotpassword", () => {
  before(async function () {
    await addUserToDB(user);
  });

  after(async function () {
    await removeUserFromDB(user.username);
  });

  describe("Email exists", () => {
    const validEmail = { email: user.email };

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgotpassword")
        .send(validEmail);
      expect(response.statusCode).to.equal(200);
    });
  });

  describe("No user with that email", () => {
    const invalidEmail = { email: faker.internet.email() };

    it("should respond with a (404: NOT FOUND) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgotpassword")
        .send(invalidEmail);
      expect(response.statusCode).to.equal(404);
    });
  });
});
