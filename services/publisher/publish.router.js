import { Router } from "express"; 
import * as pub from "./publish.controller.js";


const pubRouter = Router();

 pubRouter
    .get('/:id',pub.getPublisher)
    .post('/create',pub.createPublisher)
    
    




export default pubRouter;