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
