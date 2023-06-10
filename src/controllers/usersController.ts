import UserModel from "@/models/User";
import ErrorResponse from "@/utils/errorResponse";
import { CookieOptions, NextFunction, Request, Response } from "express";

class UsersController {
  // todo: set logger

  /**
   * @desc      Gets all users
   * @route     GET /api/v1/users
   * @access    Public
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(res.advancedResults);
  }

  /**
   * @desc      Gets a single user
   * @route     GET /api/v1/users/:id
   * @access    Public
   */
  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const user = await UserModel.findById(id);

      if (!user) {
        const error = new ErrorResponse({
          message: `User not found with id: ${id}`,
          statusCode: 404,
        });
        return next(error);
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

const usersController = new UsersController();

export default usersController;
