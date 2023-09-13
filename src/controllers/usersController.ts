import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";
import UserModel from "@/schemas/UserSchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

class UsersController {
  // todo: set logger

  /**
   * @desc      Gets all users
   * @route     GET /api/v1/users
   * @access    Public
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return res.status(HttpStatusCode.OK).json(res.advancedResults);
  }

  /**
   * @desc      Gets a single user
   * @route     GET /api/v1/users/:userId
   * @access    Public
   */
  async getUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        const error = new ErrorResponse({
          message: `User not found with id: ${req.params.userId}`,
          statusCode: HttpStatusCode.NOT_FOUND,
        });
        return next(error);
      }

      res.status(HttpStatusCode.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Follows a user
   * @route     PUT /api/v1/users/:userId/follow
   * @access    Private
   */
  async followUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next(
        new ErrorResponse({
          message: `Authenticated user is not passed with the req object. Check the auth middleware`,
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }

    const session = await mongoose.startSession();
    try {
      // 1. Check whether user exists
      const userToFollow = await UserModel.findById(req.params.userId);
      if (!userToFollow) {
        const error = new ErrorResponse({
          message: `User not found with id: ${req.params.userId}`,
          statusCode: HttpStatusCode.NOT_FOUND,
        });
        return next(error);
      }

      // 2. Check whether the user who fired the request is alreasdy a follower
      const isFollowing = userToFollow.followers.includes(req.user._id);
      if (isFollowing) {
        const error = new ErrorResponse({
          message: `User: ${req.user.username} is already following user: ${userToFollow.username}`,
          statusCode: HttpStatusCode.BAD_REQUEST,
        });
        return next(error);
      }

      // Start transaction
      session.startTransaction();

      // 3. update both users
      await UserModel.findByIdAndUpdate(userToFollow._id, {
        $addToSet: { followers: req.user._id },
      });
      const followingUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { following: userToFollow._id } },
        { returnDocument: "after" }
      );

      // finish transcation
      await session.commitTransaction();
      session.endSession();

      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: followingUser });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  /**
   * @desc      Unfollows a user
   * @route     PUT /api/v1/users/:userId/unfollow
   * @access    Private
   */
  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next(
        new ErrorResponse({
          message: `Authenticated user is not passed with the req object. Check the auth middleware`,
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }

    const session = await mongoose.startSession();
    try {
      // 1. Check whether user exists
      const userToUnfollow = await UserModel.findById(req.params.userId);
      if (!userToUnfollow) {
        const error = new ErrorResponse({
          message: `User not found with id: ${req.params.userId}`,
          statusCode: HttpStatusCode.NOT_FOUND,
        });
        return next(error);
      }

      // 2. Check whether the user who fired the request is alreasdy a follower
      const isFollowing = userToUnfollow.followers.includes(req.user._id);
      if (!isFollowing) {
        const error = new ErrorResponse({
          message: `User: ${req.user.username} is not following user: ${userToUnfollow.username}`,
          statusCode: HttpStatusCode.BAD_REQUEST,
        });
        return next(error);
      }

      // Start transaction
      session.startTransaction();

      // 3. update both users
      await UserModel.findByIdAndUpdate(userToUnfollow._id, {
        $pull: { followers: req.user._id },
      });
      const followingUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: userToUnfollow._id } },
        { returnDocument: "after" }
      );

      // finish transcation
      await session.commitTransaction();
      session.endSession();

      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: followingUser });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}

const usersController = new UsersController();

export default usersController;
