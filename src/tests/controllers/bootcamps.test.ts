import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";
import Bootcamp from "../../models/Bootcamp";

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
    const bootcampId = "5d713995b721c3bb38c1f5d0";

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${bootcampId}`
      );
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).get(
        `/api/v1/bootcamps/${bootcampId}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("document doesn't exist", () => {
    const nonExistentId = "5d713995b721c3bb38c1fddd";

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
  const bootcamp = {
    _id: "5d713995b721c3bb38c1f5d0",
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
  beforeEach(async function () {
    await Bootcamp.deleteOne({
      _id: bootcamp._id,
    });
  });

  describe("document is valid", () => {
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

  describe("unique field is duplicate (name)", () => {
    it("should respond with a (400: bad request) status code", async () => {
      await request(app).post("/api/v1/bootcamps").send(bootcamp);
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);

      expect(response.statusCode).to.equal(400);
    });

    it("should respond with json", async () => {
      await request(app).post("/api/v1/bootcamps").send(bootcamp);
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Update a bootcamp
describe("PUT /api/v1/bootcamps/:id", () => {
  describe("document exists", () => {
    const bootcampId = "5d713995b721c3bb38c1f5d0";

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app)
        .put(`/api/v1/bootcamps/${bootcampId}`)
        .send({ housing: false });
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app)
        .put(`/api/v1/bootcamps/${bootcampId}`)
        .send({ housing: true });

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
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
  describe("document exists", () => {
    const bootcamp = {
      _id: "5d713995b721c3bb38c1f5d0",
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
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp);
    });

    it("should respond with a (200: ok) status code", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${bootcamp._id}`
      );
      expect(response.statusCode).to.equal(200);
    });

    it("should respond with json", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${bootcamp._id}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(true);
    });
  });

  describe("document doesn't exist", () => {
    const nonExistentId = "5d713995b721c3bb38c1fddd";

    it("should respond with a (404: not found) status code", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${nonExistentId}`
      );

      expect(response.statusCode).to.equal(404);
    });

    it("should respond with json", async () => {
      const response = await request(app).delete(
        `/api/v1/bootcamps/${nonExistentId}`
      );

      expect(response.headers["content-type"]).to.include("json");
      expect(response.body.success).to.equal(false);
    });
  });
});

// @desc      Get bootcamps within a radius
describe("GET /api/v1/bootcamps/radius/:zipcode/:distance", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app).get(
      `/api/v1/bootcamps/radius/02881/1000`
    );
    expect(response.statusCode).to.equal(200);
  });

  it("should respond with json", async () => {
    const response = await request(app).get(
      `/api/v1/bootcamps/radius/02881/1000`
    );

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});

// @desc      Upload photo for bootcamp
describe("PUT /api/v1/bootcamps/:id", () => {
  it("should respond with a (200: ok) status code", async () => {
    const response = await request(app)
      .put(`/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/photo`)
      .send();
    expect(response.statusCode).to.equal(200);
  });

  it("should respond with json", async () => {
    const response = await request(app)
      .put(`/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/photo`)
      .send();

    expect(response.headers["content-type"]).to.include("json");
    expect(response.body.success).to.equal(true);
  });
});
