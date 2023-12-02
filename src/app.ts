import express, { Application, Router } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import expressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// import xss from "xss-clean";
import cors, { CorsOptions } from "cors";
import errorHandler from "@/middlewares/errorHandler";
import ReviewsRouter from "./routes/reviewsRouter";
import AuthRouter from "./routes/authRouter";
import UsersRouter from "@/routes/usersRouter";
import CommentsRouter from "./routes/commentsRouter";

const app: Application = express();

/* Middlewares:
- Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
- Soruce: https://expressjs.com/en/guide/writing-middleware.html
- "middlewares are generally used to transform a request or response object, before it reaches to other middlewares." - https://stackoverflow.com/a/30408863/7982963
*/

// `.use()` for middlewares
app.use(express.urlencoded({ extended: true }));

// body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// sanitize data
app.use(expressMongoSanitize());

// add security headers
app.use(helmet());

// sanitize user input
// someone creates a bootcamp with the name: "someBootcamp <script></script>"
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10000, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
const corsOptions: CorsOptions = {
  origin: [
    process.env.BUFFS_URL,
    "http://127.0.0.1",
    // your origins here
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use("/api/v1/auth", AuthRouter.init(Router()));
app.use("/api/v1/users", UsersRouter.init(Router()));
app.use("/api/v1/reviews", ReviewsRouter.init(Router()));
app.use("/api/v1/comments", CommentsRouter.init(Router()));

// error handling
app.use(errorHandler);

export default app;
