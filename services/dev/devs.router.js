import { Router } from "express";
import * as devs from "./devs.controller.js"
const devRouter = Router();

devRouter
    .get("/:id",devs.getDev)
    .post("/create",devs.createDev)


export default devRouter;