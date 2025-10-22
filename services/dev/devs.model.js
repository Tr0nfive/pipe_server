import { ROLES } from "../Roles.js";
import * as db from "./devs.db.js";
import bcrypt from "bcryptjs";

export default class Devs{
    constructor(name,email,password,role = ROLES.DEV){
        this.username=name;
        this.email=String(email).toLowerCase().trim();;
        this.pass=bcrypt.hashSync(password,12);
        this.role=role;
        
    }

   static async getDevByID(id){
    
        return await db.getDeveloperById(id)
    }

    async createDeveloper() {
        console.log('[MODEL] createDeveloper');
        return await db.insertDevDoc(this);
    }

   static async addGameDevToStore(devId,payload){
    console.log('[MODEL] addGameDevToStore called', { devId, hasPayload: !!payload })
    const newPayload = {
        name:payload.name,
        media:{
            tumbnail:payload.tumbnail,
            wideShot:payload.wideShot,
            screenshots:payload.images,
            videos:payload.videos
        },
        description:payload.shortDesc,
        price:payload.price,
        developer:payload.devName,
        publisher: payload.pubName,
        downloadLink:payload.downloadLink,


    }
    console.log('[MODEL] devId-model', devId);
    console.log('[MODEL] new payload', newPayload);

    // IMPORTANT: confirm db function exists
    console.log('[MODEL] db.addGameDevToStore typeof =', typeof db.addGameDevToStore);

    return await db.addGameDevToStore(devId,newPayload)
   }
}