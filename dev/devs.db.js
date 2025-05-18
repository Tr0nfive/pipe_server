import { MongoClient, ObjectId } from "mongodb";


export async function getDeveloperById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("users").findOne({ _id: new ObjectId(id) });
    }
    catch (err) {
        console.error("could not get dev", err);
    }
    finally {
        if (client)
            await client.close();
    }

}


export async function createDev(dev) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING)
        let db = client.db(process.env.DB_NAME);
        return await db.collection("users").insertOne(dev)
    }
    catch (err) {
        console.error("could not create dev", err)
    }
    finally {
        if (client)
            await client.close()
    }
}