declare global {
  namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
      JWT_SECRET?: string;
      NODE_ENV: "test" | "prod" | "dev";
      DB_CONNECTION_TEST?: string;
      DB_CONNECTION?: string;
      SENDER_EMAIL?: string;
      EMAIL_PASSWORD?: string;
      EMAIL_SECRET?: string;
      CLIENT_URL?: string;
    }
  }
}

export {};
