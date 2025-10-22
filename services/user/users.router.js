import { Router } from "express";
import * as user from "./user.controller.js";
import { authUser } from "../../middleware/auth.js";

const userRouter = Router()

userRouter

.get('/lib/:id', user.getUserLibary)
.get('/exists/username/:username', user.isUsernameExists)
.get('/exists/email/:email', user.isEmailExists)
.get('/wishlist/:id', user.getUserWishlist)
.get('/exists/id/:id', user.isUserExistsById)
.get('/:userId/exists/wishlist/:gameId', user.isGameInUserWishlist)

.post('/login', user.login)
.post('/add', user.addUser)
.post('/wishlist/add', user.addGameToUserWishlist)
.post('/lib/add', user.addGameToUserLibary)

.put('/update/email/:id', user.updateUserEmail)

.delete('/wishlist/remove', user.removeGameFromUserWishlist)
export default userRouter;