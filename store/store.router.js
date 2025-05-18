import { Router } from "express";
import * as store from "./store.controller.js";

const storeRouter = Router()

storeRouter
    .get('/store',store.get_store_data)
    .get('/store/:id',store.get_user_store_data)

export default storeRouter;
