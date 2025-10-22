
import { ROLES } from "../Roles.js";
import * as db from "./user.db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export default class User {
    constructor(email, password, username ) {
        this.email = email;
        this.pass = bcrypt.hashSync(password,12);
        this.username = username;
        this.role = ROLES.USER;
    }


    async addUser() {
        return await db.addUserToDB(this);

    }

    static async isUserExists(id) {
        return await db.isUserExistsById(id);
    }

    static async getUserLibary(id) {
        return await db.getUserLibary(id)
    }

    static async Login(email, password) {
        console.log('got to user model login')
        let user = await db.LoginToUser(email);
        
        console.log('user - model', user)
       
        
        console.log("model login bycrypt", bcrypt.compareSync(password, user.pass))
        if (user && bcrypt.compareSync(password, user.pass)) {
            
            delete user.pass
            let token = jwt.sign( user ,process.env.KEY,{expiresIn: 60*5}, { algorithm: 'HS256' })
            return token;
        }
        return null;
    }

    static async IsEmailTaken(email) {
        return await db.isEmailTaken(email)
    }

    static async IsUsernameExists(username) {
        return await db.isUsernameTaken(username)
    }
    static async updateUserEmail(id, email) {
        return await db.updateUserEmail(id, email)
    }
    static async GetPassById(id) {
        return await db.getPassById(id)
    }

    static async addGameToUserWishlist(userId, gameId) {
        return await db.addToUserWishlist(userId, gameId);
    }

    static async updateUserUsername(id, username) {
        return await db.updateUsername(id, username)
    }

  

    static async addGameToUserWishlist(userId, gameId) {
        return await db.addToUserWishlist(userId, gameId);
    }
    static async getUserWishlist(userId) {
        console.log('getUserWishlist - model', userId)
        return await db.getUserWishlist(userId)
      }
    
    static async removeGameFromUserWishlist(userId, gameId) {
        return await db.removeFromUserWishlist(userId, gameId);
    }
    
      
    static async isGameInUserWishlist(userId, gameId) {
        return await db.isGameInUserWishlist(userId, gameId);
    }

    static async addGameToUserLibary(userId, gameId) {
        return await db.addToUserLibary(userId, gameId);
    }



}