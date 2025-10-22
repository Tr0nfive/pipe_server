import { Router } from "express";
import * as devs from "./devs.controller.js"
const devRouter = Router();

devRouter
    .get("/:id",devs.getDev)
    
    .post("/create",devs.createDev)
    .post('/:id/game/add',devs.addGameDevToStore)

export default devRouter;