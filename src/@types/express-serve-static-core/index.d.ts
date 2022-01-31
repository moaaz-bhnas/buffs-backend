declare global {
  namespace Express {
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
