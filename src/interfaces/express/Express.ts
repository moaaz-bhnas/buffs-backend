// declaration merging: https://blog.logrocket.com/extend-express-request-object-typescript/

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
  }
}

export {};
