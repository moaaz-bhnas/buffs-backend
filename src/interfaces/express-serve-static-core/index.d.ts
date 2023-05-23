declare global {
  namespace Express {
    interface Request {
      user: any;
    }
    interface Response {
      advancedResults: {
        success: boolean;
        count: number;
        pagination: {
          [key: string]: {
            page: number;
            limit: number;
          };
        };
        data: any;
      };
    }
  }
}

export {};
