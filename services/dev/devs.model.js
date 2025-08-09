import { ROLES } from "../Roles.js";
import { getDeveloperById,createDev } from "./devs.db.js";

export default class Devs{
    constructor(name,email,password,role = ROLES.DEV){
        this.name=name;
        this.email=email;
        this.pass=password;
        this.role=role;
        
    }

   static async getDevByID(id){
        return await getDeveloperById(id)
    }

    async createDeveloper(){
        await createDev(this)
    }
}