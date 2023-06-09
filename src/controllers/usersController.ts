import { CookieOptions, NextFunction, Request, Response } from "express";

class UsersController {
  // todo: set logger

  /**
   * @desc      Gets users using filter params
   * @route     GET /api/v1/users
   * @access    Public: any user can access
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const { username, displayName, email, password, role } = req.body;
  }
}
