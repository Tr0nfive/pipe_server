
import * as db from "./user.db.js";

export default class User {
    constructor(email, pass, username) {
        this.email = email;
        this.pass = pass;
        this.username = username;
        this.role = "user"
    }

    static async getUsers(id) {

        if (!id) {
            return await db.findAllUsers();
        }
        else {
            return await db.findUserById(id);

        }
    }

    async addUser() {
        return await db.addUserToDB(this);

    }

    static async isUserExists(id) {
        return await db.isUserExistsById(id);
    }

    static async getUserLibary(email) {
        if (!email) {
            return
        }
    }

   static async Login(email) {
        return await db.LoginToUser(email,"user")
    
    }
    
    static async IsEmailTaken(email){
        return await db.isEmailTaken(email)
    }

   static async IsUsernameExists(username){
        return await db.isUsernameTaken(username)
    }
}