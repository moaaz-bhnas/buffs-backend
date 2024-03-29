declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      MONGO_URI: string;
      GEOCODER_PROVIDER: string;
      GEOCODER_API_KEY: string;
      FILE_UPLOAD_PATH: string;
      MAX_FILE_UPLOAD: string; // in bytes 1mb = 1000000byte
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: string;
      BUFFS_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
