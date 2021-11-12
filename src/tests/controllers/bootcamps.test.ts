import mocha from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../server";

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
// describe("POST /api/v1/bootcamps", () => {
//   describe("given a bootcamp id", () => {
//     it("should respond with a (201: created) status code", async () => {
//       const response = await request(app).post("/api/v1/bootcamps").send({
//         id: 1,
//       });
//       expect(response.statusCode).to.equal(201);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app).get("/api/v1/bootcamps/1").send({
//         id: 1,
//       });

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(true);
//     });
//   });

//   describe("when bootcamp id is missing", () => {
//     it("should respond with a (400: bad request) status code", async () => {
//       const response = await request(app).post("/api/v1/bootcamps").send({});
//       expect(response.statusCode).to.equal(400);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app).post("/api/v1/bootcamps").send({});

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });
// });

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
