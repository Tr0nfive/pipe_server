import { Router } from "express";
import * as user from "./user.controller.js";

const userRouter = Router()

userRouter
    .get('/',user.get_all_users)
    .get('/exists/id/:id',user.isUserExistsById)
    .get('/data',user.get_user_data)
    .get('/libary/:id',user.getUserLibary)
    .get('/store/game/:id',user.get_game_store_data)
    .get('/libary/game/install/:id',user.get_game_install_data)
    .get('/login/',user.login)
    .get('/exists/username/:username',user.isUsernameExists)
    .get('/exists/email/:email',user.isEmailExists)
    .get('/:id',user.getUserById)
    .post('/add/',user.addUser)

  
    export default userRouter;