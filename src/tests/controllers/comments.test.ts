import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";
import UsersSeeder from "@/seeders/usersSeeder";
import CommentsSeeder from "@/seeders/commentsSeeder";
import GlobalSeeder from "@/seeders/globalSeeder";
import CommentModel from "@/schemas/CommentSchema";
import mongoose from "mongoose";
import { IUser } from "@/interfaces/user/IUser";
import ReviewModel from "@/schemas/ReviewSchema";

const globalSeeder = new GlobalSeeder();
const usersSeeder = new UsersSeeder();
const commentsSeeder = new CommentsSeeder();

// authenticate
const userData = usersSeeder.generateUser();
let authUser: IUser | null = null;
let token = "";

before(async () => {
  await globalSeeder.seed({ users: 1, comments: 1, reviews: 1 });

  const signupResponse = await request(app)
    .post("/api/v1/auth/register")
    .send(userData);

  authUser = signupResponse.body.user;
  token = signupResponse.body.token;
});

after(async () => {
  await globalSeeder.unseed();
});

// @desc      Get all Comments
describe("GET /api/v1/comments", () => {
  it("should respond with a (200: OK) status code", async () => {
    const response = await request(app).get("/api/v1/comments");

    expect(response.statusCode).to.equal(HttpStatusCode.OK);
  });
});

// @desc      Create a new comment
describe("POST /api/v1/comments", () => {
  it("should respond with a (201: CREATED) status code", async () => {
    const commentData = (await commentsSeeder.generateComments(1))[0];
    const response = await request(app)
      .post("/api/v1/comments")
      .set("Authorization", `Bearer ${token}`)
      .send(commentData);
    expect(response.statusCode).to.equal(HttpStatusCode.CREATED);
  });

  it("should respond with a (404: NOT_FOUND) status code if review doesn't exist", async () => {
    const commentData = (await commentsSeeder.generateComments(1))[0];
    commentData.reviewId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post("/api/v1/comments")
      .set("Authorization", `Bearer ${token}`)
      .send(commentData);
    expect(response.statusCode).to.equal(HttpStatusCode.NOT_FOUND);
  });
});

// @desc      Edit a comment
describe("PUT /api/v1/comments/:commentId", () => {
  it("should respond with a (200: OK) status code", async () => {
    const review = await ReviewModel.findOne();
    const comment = await CommentModel.create({
      userId: authUser?._id,
      reviewId: review?._id,
      text: "Comment",
    });
    const response = await request(app)
      .put(`/api/v1/comments/${comment?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Update comment" });
    expect(response.statusCode).to.equal(HttpStatusCode.OK);
  });

  it("should respond with a (401: UNAUTHORIZED) status code if user is not author", async () => {
    const comment = await CommentModel.findOne({
      userId: { $ne: authUser?._id },
    });
    const response = await request(app)
      .put(`/api/v1/comments/${comment?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Update comment" });
    expect(response.statusCode).to.equal(HttpStatusCode.UNAUTHORIZED);
  });
});

// @desc      Like/Unlike a comment
describe("PUT /api/v1/comments/:commentId/like", () => {
  it("should respond with a (200: OK) status code", async () => {
    const comment = await CommentModel.findOne();

    // like
    const likeResponse = await request(app)
      .put(`/api/v1/comments/${comment?._id}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(likeResponse.statusCode).to.equal(HttpStatusCode.OK);
    expect(likeResponse.body.data.likes).to.include(authUser?._id);

    // unlike
    const unlikeResponse = await request(app)
      .put(`/api/v1/comments/${comment?._id}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(unlikeResponse.statusCode).to.equal(HttpStatusCode.OK);
    expect(unlikeResponse.body.data.likes).to.not.include(authUser?._id);
  });

  it("should respond with a (404: NOT_FOUND) status code if comment doesn't exist", async () => {
    const response = await request(app)
      .put(`/api/v1/comments/${new mongoose.Types.ObjectId()}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).to.equal(HttpStatusCode.NOT_FOUND);
  });
});

// @desc      Delete a comment
describe("Delete /api/v1/comments/:commentId", () => {
  it("should respond with a (200: OK) status code", async () => {
    const review = await ReviewModel.findOne();
    const comment = await CommentModel.create({
      userId: authUser?._id,
      reviewId: review?._id,
      text: "Comment",
    });
    const response = await request(app)
      .delete(`/api/v1/comments/${comment?._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).to.equal(HttpStatusCode.OK);
  });

  it("should respond with a (404: NOT_FOUND) status code if comment doesn't exist", async () => {
    const response = await request(app)
      .delete(`/api/v1/comments/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).to.equal(HttpStatusCode.NOT_FOUND);
  });
});
