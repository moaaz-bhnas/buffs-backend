import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import UserModel from "../../models/User";

// @desc      Register user
describe("POST /api/v1/auth/register", () => {
  describe("Email is valid", () => {
    const user = {
      name: "yuuri",
      email: "yuuri@yahoo.com",
      password: "yuuri228",
      role: "user",
    };

    afterEach(async function () {
      await UserModel.deleteOne({
        name: user.name,
      });
    });

    it("should respond with a (201: created) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(user);
      expect(response.statusCode).to.equal(201);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(user);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("Email is not valid", () => {
    const invalidUser = {
      name: "yuuri",
      email: "yuuri@yahoo",
      password: "yuuri228",
      role: "user",
    };

    it("should respond with a (400: bad request) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidUser);
      expect(response.statusCode).to.equal(400);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidUser);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Login user
describe("POST /api/v1/auth/login", () => {
  const user = {
    name: "yurio",
    email: "yurio@yahoo.com",
    password: "yurio228",
    role: "user",
  };

  before(async function () {
    await UserModel.create(user);
  });

  after(async function () {
    await UserModel.deleteOne({ name: user.name });
  });

  describe("Email is valid", () => {
    const validCredentials = { email: user.email, password: user.password };

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(validCredentials);
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(validCredentials);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("Email is not valid", () => {
    const invalidCredentials = {
      email: "yurio@yahoo",
      password: user.password,
    };

    it("should respond with a (401: unauthorized) status code", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(invalidCredentials);
      expect(response.statusCode).to.equal(401);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(invalidCredentials);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});
