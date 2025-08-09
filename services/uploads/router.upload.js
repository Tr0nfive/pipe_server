import { Router } from "express";
import { upload } from "./upload.controller";
const uploadRouter = Router();






uploadRouter
            .post('/game/:gameId',upload)
