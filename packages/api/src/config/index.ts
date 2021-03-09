// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const port = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "bloop";
export const NODE_ENV = process.env.NODE_ENV || "dev";
const { DB_CONNECTION, DB_CONNECTION_TEST } = process.env;
export let mongoURI = "";
export const SENDER_EMAIL = process.env.SENDER_EMAIL || "test@email.com";
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "12345";
export const EMAIL_SECRET = process.env.EMAIL_SECRET || "bleep";
export const CLIENT_URL = process.env.CLIENT_URL || "sergei-dev.me";

if (NODE_ENV === "test" && DB_CONNECTION_TEST) {
  mongoURI = DB_CONNECTION_TEST.split("issue_tracker_testing").join(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    "testing_db_" + process.env.JEST_WORKER_ID
  );
  // console.log(mongoURI);
} else if (DB_CONNECTION) {
  mongoURI = DB_CONNECTION;
}
