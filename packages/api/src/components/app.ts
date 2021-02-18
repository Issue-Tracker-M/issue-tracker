import { port } from "./../config/index";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./auth/routes";
import workspaceRouter from "../components/workspaces/routes";
import errorHandler from "errorhandler";
import morgan from "morgan";

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/workspaces", workspaceRouter);

const app = express();

app.set("port", port);
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  cors({
    credentials: true,
    exposedHeaders: ["set-cookie"],
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1",
      "http://104.142.122.231",
    ],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/", (_, res: express.Response) => {
  return res.status(200).json({ message: "API is up 🚀" });
});

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
  app.use(errorHandler());
}
app.all("*", (_, res: express.Response) => {
  res.status(404).json({ message: "This URL can not be found!" });
});

export default app;
