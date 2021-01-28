import dotenv from "dotenv";
import app from "./components/app";
dotenv.config();

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
