
import { createPublishInDB, getPublisherFromDB } from "./publish.db.js";


export default class Pub {
    constructor(name, password, email) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = "publisher"
    }

    async createPublisher() {
        await createPublishInDB(this);
    }
    static async getPublisher(id) {
        return await getPublisherFromDB(id);
    }


}