import { Router } from "express";
import * as user from "./user.controller.js";
import { authUser } from "../../middleware/auth.js";

const userRouter = Router()

userRouter
    
    .get('/exists/id/:id',user.isUserExistsById)
    .get('/libary/:id',authUser,user.getUserLibary)
    .get('/exists/username/:username',user.isUsernameExists)
    .get('/exists/email/:email',user.isEmailExists)
    .get('/games',user.getGamesStore)
    .post('/login',user.login)
    .post('/add',user.addUser)
    .put('/update/email/:id',authUser,user.updateUserEmail)
    
    export default userRouter;