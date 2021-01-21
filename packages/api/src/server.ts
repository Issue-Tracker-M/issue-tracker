require("dotenv").config();
import errorHandler from "errorhandler";
import app from "./api/app";

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
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
