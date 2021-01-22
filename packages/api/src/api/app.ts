import { port, mongoURI } from "./../config/index";
import express = require("express");
import mongoose = require("mongoose");
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((conn) =>
    console.log(
      `MongoDB connection with url successful @: ${conn.connection.host}`
    )
  )
  .catch((err) => {
    console.log(err);
  });
require("../models");
import bodyParser = require("body-parser");
import cors = require("cors");
import helmet = require("helmet");
import authRouter from "../routes/authRouter";
import taskRouter from "../routes/taskRouter";
import workspaceRouter from "../routes/workspaceRouter";

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
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
  res.status(404).json({ message: "This URL can not be found" });
});

export default app;
