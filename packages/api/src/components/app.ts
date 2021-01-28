import { port, mongoURI } from "./../config/index";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./auth/routes";
import workspaceRouter from "../components/workspaces/routes";
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
    console.log(err, "THIS IS HAPPENING TOO EARLY");
  });
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/workspaces", workspaceRouter);

const app = express();

app.set("port", port);
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/", (_, res: express.Response) => {
  return res.status(200).json({ message: "API is up 🚀" });
});

app.all("*", (_, res: express.Response) => {
  res.status(404).json({ message: "This URL can not be found!" });
});

export default app;
