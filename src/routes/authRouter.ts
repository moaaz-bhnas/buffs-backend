import {
  CookieOptions,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { Document } from "mongoose";
import UserModel from "@/schemas/UserSchema";
import ErrorResponse from "@/utils/errorResponse";
import { IUser } from "@/interfaces/user/IUser";
import { IUserMethods } from "@/interfaces/user/IUserMethods";
import { RegisteringUser } from "@/interfaces/user/RegisteringUser";
import { protect } from "../middlewares/protect";

export default class AuthRouter {
  // todo: set logger

  static init(router: Router): Router {
    router.post("/register", this.register);
    router.post("/login", this.login);
    router.get("/logout", this.logout);
    router.get("/me", protect, this.getMe);
    router.get("/forgotpassword", this.forgotPassword);

    return router;
  }

  /**
   * Using a cookie is safer than storing the token in the local storage
   * Get token from model, create cookie and send response
   */
  private static sendTokenResponse(
    user: Document<{}, {}, IUser> & IUserMethods,
    statusCode: number,
    res: Response
  ) {
    // Create token
    const token = user.getSignedJwtToken();

    const JWT_COOKIE_EXPIRE = Number(process.env.JWT_COOKIE_EXPIRE) ?? 30;

    const options: CookieOptions = {
      expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true, // because we want the cookie to only be accessed through the client-side
    };

    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  }

  /**
   * @desc      Register user
   * @route     POST /api/v1/auth/register
   * @access    Public: any user can access
   */
  private static async register(
    req: Request<{}, {}, RegisteringUser>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserModel.create(req.body);
      AuthRouter.sendTokenResponse(user, 201, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Login user
   * @route     POST /api/v1/auth/login
   * @access    Public: any user can access
   */
  private static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    // Verify email and password
    if (!email || !password) {
      const error = new ErrorResponse({
        message: "Please provide an email and password",
        statusCode: 400,
      });
      return next(error);
    }

    try {
      // Check email
      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        const error = new ErrorResponse({
          message: "Invalid credentials",
          statusCode: 401,
        });
        return next(error);
      }

      // Check password
      const passwordIsMatch = await user.matchPassword(password);

      if (!passwordIsMatch) {
        const error = new ErrorResponse({
          message: "Invalid credentials",
          statusCode: 401,
        });
        return next(error);
      }

      AuthRouter.sendTokenResponse(user, 200, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Log user out
   * @route     GET /api/v1/auth/logout
   * @access    Public
   */
  private static logout(req: Request, res: Response, next: NextFunction) {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000), // 10 sec
      httpOnly: true, // because we want the cookie to only be accessed through the client-side
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  }

  /**
   * @desc      Get logged-in user
   * @route     GET /api/v1/auth/me
   * @access    Private
   */
  private static async getMe(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }

  /**
   * @desc      Forgot password
   * @route     POST /api/v1/auth/forgotpassword
   * @access    Public
   */
  private static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      const error = new ErrorResponse({
        message: "There is no user with that email",
        statusCode: 404,
      });
      return next(error);
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    console.log("resetToken: ", resetToken);

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
}
