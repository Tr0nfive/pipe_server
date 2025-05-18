import { getDeveloperById,createDev } from "./devs.db.js";

export default class Devs{
    constructor(name,email,password){
        this.name=name;
        this.email=email;
        this.password=password;
        this.role = "developer"
    }

   static async getDevByID(id){
        return await getDeveloperById(id)
    }

    async createDeveloper(){
        await createDev(this)
    }
}