import dotenv from "dotenv";
import errorHandler from "errorhandler";
import app from "./components/app";
import { isBaseTask, isTypedArray } from "@issue-tracker/types";
isTypedArray([], isBaseTask);
dotenv.config();
/**
 * Error Handler. Provides full stack - remove for production
 */
if (process.env.NODE_ENV === "dev") {
  app.use(errorHandler());
}
/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
