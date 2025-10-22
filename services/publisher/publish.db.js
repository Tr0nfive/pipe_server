import { MongoClient, ObjectId } from "mongodb";


export async function createPublishInDB(publish) {
    let client = null;
    try {
         client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.DB_NAME);
        return await db.collection("users").insertOne(publish);

    } catch (err) {
        console.error("user wasnt able to be added", err)
    }
    finally {
        if (client)
            client.close();
    }

}

export async function getPublisherFromDB(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("users").findOne({ _id: new ObjectId(id) },{projection:{}});
    }
    catch (err) {
        console.error("could not find user", err)
    }
    finally {
        if (client)
            client.close();


    }
}
