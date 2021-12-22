import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import Course from "../../models/Course";

// @desc      Get all courses
describe("GET /api/v1/courses", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get("/api/v1/courses");

    expect(response.statusCode).to.equal(200);
  });

  it("should respond with json", async () => {
    const response = await request(app).get("/api/v1/courses");

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});

// @desc      Get all bootcamp courses
describe("GET /api/v1/bootcamps/:bootcampId/courses", () => {
  const bootcampId = "5d713995b721c3bb38c1f5d0";

  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get(
      `/api/v1/bootcamps/${bootcampId}/courses`
    );

    expect(response.statusCode).to.equal(200);
  });

  it("should respond with json", async () => {
    const response = await request(app).get(
      `/api/v1/bootcamps/${bootcampId}/courses`
    );

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});
