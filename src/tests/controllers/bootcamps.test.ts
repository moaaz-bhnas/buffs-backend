import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import Bootcamp from "../../models/Bootcamp";
import { ObjectId } from "mongodb";

const bootcamp = {
  _id: "5d725a037b292f5f8ceff787",
  user: "5c8a1d5b0190b214360dc031",
  name: "Codemasters",
  description:
    "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in full stack web development and data science",
  website: "https://codemasters.com",
  phone: "(333) 333-3333",
  email: "enroll@codemasters.com",
  address: "85 South Prospect Street Burlington VT 05405",
  careers: ["Web Development", "Data Science", "Business"],
  housing: false,
  jobAssistance: false,
  jobGuarantee: false,
  acceptGi: false,
};

// @desc      Get all bootcamps
describe("GET /api/v1/bootcamps", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get("/api/v1/bootcamps");
    expect(response.statusCode).to.equal(200);
  });

  it("should respond with json", async () => {
    const response = await request(app).get("/api/v1/bootcamps");

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});

// @desc      Get a single bootcamp
describe("GET /api/v1/bootcamps/:id", () => {
  describe("bootcamp id exists", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).get("/api/v1/bootcamps/1");
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).get("/api/v1/bootcamps/1");

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  // describe("bootcamp id doesn't exist", () => {});
});

// @desc      Create a bootcamp
describe("POST /api/v1/bootcamps", () => {
  // runs after each test in this block
  afterEach(async function () {
    await Bootcamp.deleteOne({
      _id: new ObjectId(bootcamp._id),
    });
  });

  it("should respond with a (201: created) status code", async () => {
    const response = await request(app)
      .post("/api/v1/bootcamps")
      .send(bootcamp);
    expect(response.statusCode).to.equal(201);
  });

  it("should respond with json", async () => {
    const response = await request(app)
      .post("/api/v1/bootcamps")
      .send(bootcamp);

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});

// @desc      Update a bootcamp
describe("PUT /api/v1/bootcamps/:id", () => {
  describe("bootcamp id exists", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).put("/api/v1/bootcamps/1");
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).put("/api/v1/bootcamps/1");

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  // describe("bootcamp id doesn't exist", () => {});
});

// @desc      Delete a bootcamp
describe("DELETE /api/v1/bootcamps/:id", () => {
  describe("bootcamp id exists", () => {
    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).delete("/api/v1/bootcamps/1");
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).delete("/api/v1/bootcamps/1");

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  // describe("bootcamp id doesn't exist", () => {});
});
