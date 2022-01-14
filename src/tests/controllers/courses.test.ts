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

// @desc      Get a single course
describe("GET /api/v1/courses/:id", () => {
  describe("course exists", () => {
    const courseId = "5d725a4a7b292f5f8ceff789";

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).get(`/api/v1/courses/${courseId}`);
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).get(`/api/v1/courses/${courseId}`);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("course doesn't exist", () => {
    const nonExistentId = "5d725a4a7b292f5f8ceff000";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app).get(
        `/api/v1/courses/${nonExistentId}`
      );
      expect(response.statusCode).to.equal(404);
    });

    it("should respond with json", async () => {
      const response = await request(app).get(
        `/api/v1/courses/${nonExistentId}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Create a course in a bootcamp
describe("POST /api/v1/bootcamps/:bootcampId/courses", () => {
  const bootcampId = "5d713995b721c3bb38c1f5d0";

  const course = {
    _id: "5d725a4a7b292f5f8ceff789",
    title: "Front End Web Development",
    description:
      "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
    weeks: 8,
    tuition: 8000,
    minimumSkill: "beginner",
    scholarhipsAvailable: true,
    bootcamp: "5d713995b721c3bb38c1f5d0",
    user: "5d7a514b5d2c12c7449be045",
  };

  // runs before each test in this block
  beforeEach(async function () {
    await Course.deleteOne({
      _id: course._id,
    });
  });

  describe("course document is valid", () => {
    it("should respond with a (201: created) status code", async () => {
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);
      expect(response.statusCode).to.equal(201);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("required field is missing (title)", () => {
    const invalidCourse: { [key: string]: any } = { ...course };
    delete invalidCourse.title;

    it("should respond with a (400: bad request) status code", async () => {
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(invalidCourse);

      expect(response.statusCode).to.equal(400);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(invalidCourse);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });

  describe("unique field is duplicate (title)", () => {
    it("should respond with a (400: bad request) status code", async () => {
      await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);

      expect(response.statusCode).to.equal(400);
    });

    it("should respond with json", async () => {
      await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);
      const response = await request(app)
        .post(`/api/v1/bootcamps/${bootcampId}/courses`)
        .send(course);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Update a course
describe("PUT /api/v1/courses/:id", () => {
  describe("course exists", () => {
    const courseId = "5d725c84c4ded7bcb480eaa0";

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .send({ scholarshipAvailable: false });
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .send({ scholarshipAvailable: true });

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("course doesn't exist", () => {
    const nonExistentId = "5d725c84c4ded7bcb4800000";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app)
        .put(`/api/v1/courses/${nonExistentId}`)
        .send({ scholarshipAvailable: false });
      expect(response.statusCode).to.equal(404);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .put(`/api/v1/courses/${nonExistentId}`)
        .send({ scholarshipAvailable: false });

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});
