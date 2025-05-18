
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
        return db.addUserToDB(this);

    }

    static async isUserExists(id) {
        return await db.isUserExistsById(id);
    }

    static async getUserLibary(email) {
        if (!email) {
            return
        }
    }

    async Login(email, pass) {
       return await db.LoginToUser(email,pass,"user")
    }
    
    static async IsEmailTaken(email,username){
        return await db.isEmailTaken(email,username)
    }

   static async IsUsernameExists(username){
        return await db.isUsernameTaken(username)
    }
}