import dotenv from "dotenv";

import app from "./components/app";
dotenv.config();

export function bootstrap(): void {
  try {
    // init db connection

    /**
     * Start Express server.
     */
    app.listen(app.get("port"), () => {
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `App is running at http://localhost:${app.get("port")} in ${app.get(
          "env"
        )} mode`
      );
      console.log("  Press CTRL-C to stop\n");
    });
  } catch (error) {
    console.log(error, "This shouldn't be happening");
  }
}

bootstrap();

export * from "./utils/typeUtils";
export * from "./components/auth/middleware";
export * from "./components/auth/validation";
export { registerInput } from "./components/auth/controller";
export { getInviteData } from "./publicTypes/index";
