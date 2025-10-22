import { Router } from "express";
import * as store from "./store.controller.js";

const storeRouter = Router()

storeRouter
    .get('/hardware', store.getHardwareDb)
    .get('/', store.getGamesStore)
    .get('/search/:name', store.searchGameByName)
    .get('/:id', store.getGameById)
    .get('/page/:id', store.getGameStorePage)
    .get('/:id/req', store.getGameRequirements)
    
    .post('benchmark/:id/save',store.saveGameBenchmarkVerdict)
export default storeRouter;
