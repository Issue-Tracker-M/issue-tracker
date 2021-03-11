import { CLIENT_URL, mongoURI, NODE_ENV, port } from "./../config/index";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./auth/routes";
import tasksRouter from "./tasks/routes";
import workspaceRouter from "../components/workspaces/routes";
import errorHandler from "errorhandler";
import morgan from "morgan";
import mongoose from "mongoose";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((conn) => {
    app.set("db_connection", conn);
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `MongoDB connection with url successful @: ${conn.connection.host}:${conn.connection.port}`
    );
  })
  .catch((err) => {
    console.log(err, "This shouldn't be happening");
  });

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/workspaces", workspaceRouter);

const app = express();

app.set("port", port);
app.use(helmet());
if (!(NODE_ENV === "dev" || NODE_ENV === "test")) {
  app.use(morgan("tiny"));
}
app.use(
  cors({
    credentials: true,
    exposedHeaders: ["set-cookie"],
    origin: CLIENT_URL,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (_, res: express.Response) => {
  return res.status(200).json({ message: "API is up 🚀" });
});

if (NODE_ENV === "dev" || NODE_ENV === "test") {
  app.use(errorHandler());
}
app.all("*", (_, res: express.Response) => {
  res.status(404).json({ message: "This URL can not be found!" });
});

export default app;
