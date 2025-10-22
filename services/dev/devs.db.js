import { MongoClient, ObjectId } from "mongodb";


export async function getDeveloperById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
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


export async function insertDevDoc(dev) {
    let client;
    try {
      client = await MongoClient.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      const db = client.db(process.env.DB_NAME);
      console.log('[DB] insertDevDoc -> users.insertOne');
      return await db.collection('users').insertOne(dev);
    } finally {
      if (client) await client.close();
    }
  }


  
export async function addGameDevToStore(devId, payload) {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const db = client.db(process.env.DB_NAME);

    const gamesCol = db.collection('games');
    const usersCol = db.collection('users');
    console.log('[DB] devId',devId);
    

    const devObjectId = typeof devId === 'string' ?  ObjectId.createFromHexString(devId) : devId;

    // Build the new game document based on your collection structure
   

    // Insert the game into the "games" collection
    console.log('[DB] addGameDevToStore -> games.insertOne');
    const insertResult = await gamesCol.insertOne(payload);
    const newGameId = insertResult.insertedId;

    // Update the dev user document to include this new game
    console.log('[DB] addGameDevToStore -> users.updateOne (add to createdGames)');
    const updateResult = await usersCol.updateOne(
      { _id: devObjectId },
      {
        $push: {
          createdGames: {
            gameId: newGameId,
            name: payload.name,
            addedAt: new Date()
          }
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      console.warn('[DB] Developer not found for devId:', devId);
      return { ok: false, message: 'Developer not found', gameId: newGameId };
    }

    return { ok: true, gameId: newGameId, name: payload.name };
  } catch (err) {
    console.error('[DB] addGameDevToStore error:', err);
    throw err;
  } finally {
    if (client) await client.close();
  }
}