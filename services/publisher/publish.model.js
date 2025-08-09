
import { ROLES } from "../Roles.js";
import { createPublishInDB, getPublisherFromDB } from "./publish.db.js";
import bcrypt from "bcryptjs";


export default class Pub {
    constructor(name, password, email, role = ROLES.PUBLISHER) {
        this.name = name;
        this.pass = bcrypt.hashSync(password, 12); // Hashing the password
        this.email = email;
        this.role = role;
    }

    async createPublisher() {
        await createPublishInDB(this);
    }
    static async getPublisher(id) {
        return await getPublisherFromDB(id);
    }


}