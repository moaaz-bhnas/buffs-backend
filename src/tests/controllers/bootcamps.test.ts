// import fs from "fs";
// import mocha from "mocha";
// import { expect } from "chai";
// import request from "supertest";
// import app from "../../server";
// import Bootcamp from "../../models/Bootcamp";
// import path from "path";

// // @desc      Get all bootcamps
// describe("GET /api/v1/bootcamps", () => {
//   it("should respond with a (200: ok) status code", async () => {
//     const response = await request(app).get("/api/v1/bootcamps");

//     expect(response.statusCode).to.equal(200);
//   });

//   it("should respond with json", async () => {
//     const response = await request(app).get("/api/v1/bootcamps");

//     expect(response.headers["content-type"]).to.include("json");
//     expect(response.body.success).to.equal(true);
//   });
// });

// // @desc      Get a single bootcamp
// describe("GET /api/v1/bootcamps/:id", () => {
//   describe("document exists", () => {
//     const bootcampId = "5d713995b721c3bb38c1f5d0";

//     it("should respond with a (200: ok) status code", async () => {
//       const response = await request(app).get(
//         `/api/v1/bootcamps/${bootcampId}`
//       );
//       expect(response.statusCode).to.equal(200);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app).get(
//         `/api/v1/bootcamps/${bootcampId}`
//       );

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(true);
//     });
//   });

//   describe("document doesn't exist", () => {
//     const nonExistentId = "5d713995b721c3bb38c1fddd";

//     it("should respond with a (404: not found) status code", async () => {
//       const response = await request(app).get(
//         `/api/v1/bootcamps/${nonExistentId}`
//       );
//       expect(response.statusCode).to.equal(404);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app).get(
//         `/api/v1/bootcamps/${nonExistentId}`
//       );

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });
// });

// // @desc      Create a bootcamp
// describe("POST /api/v1/bootcamps", () => {
//   let token = "";

//   // Runs before all tests
//   before(async function getToken() {
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({ email: "john@gmail.com", password: "123456" });

//     token = response.body.token;
//   });

//   const bootcamp = {
//     _id: "5d713995b721c3bb38c1f5d0",
//     user: "5d7a514b5d2c12c7449be045",
//     name: "Devworks Bootcamp",
//     description:
//       "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
//     website: "https://devworks.com",
//     phone: "(111) 111-1111",
//     email: "enroll@devworks.com",
//     address: "233 Bay State Rd Boston MA 02215",
//     careers: ["Web Development", "UI/UX", "Business"],
//     housing: true,
//     jobAssistance: true,
//     jobGuarantee: false,
//     acceptGi: true,
//   };

//   // runs before each test in this block
//   beforeEach(async function () {
//     await request(app)
//       .delete(`/api/v1/bootcamps/${bootcamp._id}`)
//       .set("Authorization", `Bearer ${token}`);
//   });

//   describe("document is valid", () => {
//     it("should respond with a (201: created) status code", async () => {
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);
//       expect(response.statusCode).to.equal(201);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(true);
//     });
//   });

//   describe("required field is missing (name)", () => {
//     const bootcampWithoutName = {
//       user: "5d7a514b5d2c12c7449be045",
//       description:
//         "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
//       website: "https://devworks.com",
//       phone: "(111) 111-1111",
//       email: "enroll@devworks.com",
//       address: "233 Bay State Rd Boston MA 02215",
//       careers: ["Web Development", "UI/UX", "Business"],
//       housing: true,
//       jobAssistance: true,
//       jobGuarantee: false,
//       acceptGi: true,
//     };

//     it("should respond with a (400: bad request) status code", async () => {
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcampWithoutName);

//       expect(response.statusCode).to.equal(400);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcampWithoutName);

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });

//   describe("unique field is duplicate (name)", () => {
//     it("should respond with a (400: bad request) status code", async () => {
//       await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);

//       expect(response.statusCode).to.equal(400);
//     });

//     it("should respond with json", async () => {
//       await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);
//       const response = await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });
// });

// // @desc      Update a bootcamp
// describe("PUT /api/v1/bootcamps/:id", () => {
//   let token = "";

//   // Runs before all tests
//   before(async function getToken() {
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({ email: "john@gmail.com", password: "123456" });

//     token = response.body.token;
//   });

//   describe("document exists", () => {
//     const bootcampId = "5d713995b721c3bb38c1f5d0";

//     it("should respond with a (200: ok) status code", async () => {
//       const response = await request(app)
//         .put(`/api/v1/bootcamps/${bootcampId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({ housing: false });
//       expect(response.statusCode).to.equal(200);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .put(`/api/v1/bootcamps/${bootcampId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({ housing: true });

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(true);
//     });
//   });

//   describe("document doesn't exist", () => {
//     const nonExistentId = "5d713995b721c3bb38c1f5b4";

//     it("should respond with a (404: not found) status code", async () => {
//       const response = await request(app)
//         .put(`/api/v1/bootcamps/${nonExistentId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({ jobAssistance: false });
//       expect(response.statusCode).to.equal(404);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .put(`/api/v1/bootcamps/${nonExistentId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({ jobAssistance: false });

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });
// });

// // @desc      Delete a bootcamp
// describe("DELETE /api/v1/bootcamps/:id", () => {
//   let token = "";

//   // Runs before all tests
//   before(async function getToken() {
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({ email: "john@gmail.com", password: "123456" });

//     token = response.body.token;
//   });

//   describe("document exists", () => {
//     const bootcamp = {
//       _id: "5d713995b721c3bb38c1f5d0",
//       user: "5d7a514b5d2c12c7449be045",
//       name: "Devworks Bootcamp",
//       description:
//         "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
//       website: "https://devworks.com",
//       phone: "(111) 111-1111",
//       email: "enroll@devworks.com",
//       address: "233 Bay State Rd Boston MA 02215",
//       careers: ["Web Development", "UI/UX", "Business"],
//       housing: true,
//       jobAssistance: true,
//       jobGuarantee: false,
//       acceptGi: true,
//     };

//     const attachedCourses = [
//       {
//         _id: "5d725a4a7b292f5f8ceff789",
//         title: "Front End Web Development",
//         description:
//           "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
//         weeks: 8,
//         tuition: 8000,
//         minimumSkill: "beginner",
//         scholarhipsAvailable: true,
//         bootcamp: "5d713995b721c3bb38c1f5d0",
//         user: "5d7a514b5d2c12c7449be045",
//       },
//       {
//         _id: "5d725c84c4ded7bcb480eaa0",
//         title: "Full Stack Web Development",
//         description:
//           "In this course you will learn full stack web development, first learning all about the frontend with HTML/CSS/JS/Vue and then the backend with Node.js/Express/MongoDB",
//         weeks: 12,
//         tuition: 10000,
//         minimumSkill: "intermediate",
//         scholarhipsAvailable: true,
//         bootcamp: "5d713995b721c3bb38c1f5d0",
//         user: "5d7a514b5d2c12c7449be045",
//       },
//     ];

//     afterEach(async function () {
//       // Re-insert bootcamp
//       await request(app)
//         .post("/api/v1/bootcamps")
//         .set("Authorization", `Bearer ${token}`)
//         .send(bootcamp);

//       // Re-insert attached courses
//       await request(app)
//         .post(`/api/v1/bootcamps/${bootcamp._id}/courses`)
//         .set("Authorization", `Bearer ${token}`)
//         .send(attachedCourses[0]);
//       await request(app)
//         .post(`/api/v1/bootcamps/${bootcamp._id}/courses`)
//         .set("Authorization", `Bearer ${token}`)
//         .send(attachedCourses[1]);
//     });

//     it("should respond with a (200: ok) status code", async () => {
//       const response = await request(app)
//         .delete(`/api/v1/bootcamps/${bootcamp._id}`)
//         .set("Authorization", `Bearer ${token}`);
//       expect(response.statusCode).to.equal(200);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .delete(`/api/v1/bootcamps/${bootcamp._id}`)
//         .set("Authorization", `Bearer ${token}`);

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(true);
//     });
//   });

//   describe("document doesn't exist", () => {
//     const nonExistentId = "5d713995b721c3bb38c1fddd";

//     it("should respond with a (404: not found) status code", async () => {
//       const response = await request(app)
//         .delete(`/api/v1/bootcamps/${nonExistentId}`)
//         .set("Authorization", `Bearer ${token}`);

//       expect(response.statusCode).to.equal(404);
//     });

//     it("should respond with json", async () => {
//       const response = await request(app)
//         .delete(`/api/v1/bootcamps/${nonExistentId}`)
//         .set("Authorization", `Bearer ${token}`);

//       expect(response.headers["content-type"]).to.include("json");
//       expect(response.body.success).to.equal(false);
//     });
//   });
// });

// // @desc      Get bootcamps within a radius
// describe("GET /api/v1/bootcamps/radius/:zipcode/:distance", () => {
//   it("should respond with a (200: ok) status code", async () => {
//     const response = await request(app).get(
//       `/api/v1/bootcamps/radius/02881/1000`
//     );
//     expect(response.statusCode).to.equal(200);
//   });

//   it("should respond with json", async () => {
//     const response = await request(app).get(
//       `/api/v1/bootcamps/radius/02881/1000`
//     );

//     expect(response.headers["content-type"]).to.include("json");
//     expect(response.body.success).to.equal(true);
//   });
// });
