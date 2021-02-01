import dotenv from "dotenv";
import { mongoURI } from "./config/index";
import mongoose from "mongoose";

import app from "./components/app";
dotenv.config();

async function bootstrap() {
  try {
    // init db connection
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    app.set("db_connection", conn);
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
    return server;
  } catch (error) {
    console.log(error, "This shouldn't be happening");
  }
}

bootstrap().catch(console.log);
