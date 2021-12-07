import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import Bootcamp from "../../models/Bootcamp";
import { Document } from "mongoose";

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
  describe("document exists", () => {
    const documentId = "61acc4bf4b79906525e8a34f";

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${documentId}`
      );
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${documentId}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("document doesn't exist", () => {
    const nonExistentId = "5d713995b721c3bb38c1f5d0";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${nonExistentId}`
      );
      expect(response.statusCode).to.equal(404);
    });

    it("should respond with json", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${nonExistentId}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Create a bootcamp
describe("POST /api/v1/bootcamps", () => {
  describe("document with all required fields", () => {
    const bootcamp = {
      user: "5d7a514b5d2c12c7449be045",
      name: "Devworks Bootcamp",
      description:
        "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
      website: "https://devworks.com",
      phone: "(111) 111-1111",
      email: "enroll@devworks.com",
      address: "233 Bay State Rd Boston MA 02215",
      careers: ["Web Development", "UI/UX", "Business"],
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGi: true,
    };

    // runs after each test in this block
    afterEach(async function () {
      await Bootcamp.deleteOne({
        name: bootcamp.name,
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

  describe("required field is missing (name)", () => {
    const bootcampWithoutName = {
      user: "5d7a514b5d2c12c7449be045",
      description:
        "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
      website: "https://devworks.com",
      phone: "(111) 111-1111",
      email: "enroll@devworks.com",
      address: "233 Bay State Rd Boston MA 02215",
      careers: ["Web Development", "UI/UX", "Business"],
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGi: true,
    };

    it("should respond with a (400: bad request) status code", async () => {
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcampWithoutName);
      expect(response.statusCode).to.equal(400);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcampWithoutName);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Update a bootcamp
describe("PUT /api/v1/bootcamps/:id", () => {
  describe("document exists", () => {
    const bootcamp = {
      user: "5d7a514b5d2c12c7449be045",
      name: "Devworks Bootcamp",
      description:
        "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
      website: "https://devworks.com",
      phone: "(111) 111-1111",
      email: "enroll@devworks.com",
      address: "233 Bay State Rd Boston MA 02215",
      careers: ["Web Development", "UI/UX", "Business"],
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGi: true,
    };

    afterEach(async function () {
      await Bootcamp.deleteOne({
        name: bootcamp.name,
      });
    });

    it("should respond with a (200: ok) status code", async () => {
      const createResponse = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);
      const updateResponse = await request(app)
        .put(`/api/v1/bootcamps/${createResponse.body.data._id}`)
        .send({ jobAssistance: false });
      expect(updateResponse.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const createResponse = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);
      const updateResponse = await request(app)
        .put(`/api/v1/bootcamps/${createResponse.body.data._id}`)
        .send({ jobAssistance: false });
      expect(updateResponse.headers["content-type"]).to.include("json");
      expect(updateResponse.body.success).to.equal(true);
    });
  });

  describe("document doesn't exist", () => {
    const nonExistentId = "5d713995b721c3bb38c1f5b4";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app)
        .put(`/api/v1/bootcamps/${nonExistentId}`)
        .send({ jobAssistance: false });
      expect(response.statusCode).to.equal(404);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .put(`/api/v1/bootcamps/${nonExistentId}`)
        .send({ jobAssistance: false });

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Delete a bootcamp
describe("DELETE /api/v1/bootcamps/:id", () => {
  describe("bootcamp id exists", () => {
    const bootcamp = {
      user: "5d7a514b5d2c12c7449be045",
      name: "Devworks Bootcamp",
      description:
        "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
      website: "https://devworks.com",
      phone: "(111) 111-1111",
      email: "enroll@devworks.com",
      address: "233 Bay State Rd Boston MA 02215",
      careers: ["Web Development", "UI/UX", "Business"],
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGi: true,
    };

    let idToDelete: string;

    beforeEach(async function () {
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);

      idToDelete = response.body.data._id;
    });

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${idToDelete}`
      );
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${idToDelete}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  // describe("bootcamp id doesn't exist", () => {});
});
