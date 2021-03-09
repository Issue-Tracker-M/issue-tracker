import { Router } from "express";
import { createList, patchList } from "./controller";
const listRouter = Router();

listRouter.post(`/`, createList);
listRouter.patch(`/:list_id`, patchList);

export default listRouter;
