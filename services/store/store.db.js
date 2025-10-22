import { MongoClient, ObjectId } from "mongodb";

export async function getGamesStore() {
   let client = null;
   try {
       client = await MongoClient.connect(process.env.MONGO_URI);
       let db = client.db(process.env.DB_NAME);
       return await db.collection("games").find({}).toArray();
   }
   catch (err) {
       console.error("could not get store games", err)
   }
   finally {
       if (client)
           client.close()
   }
}

export async function getGameById(id) {
   let client = null;
   try {
       client = await MongoClient.connect(process.env.MONGO_URI);
       let db = client.db(process.env.DB_NAME);
       return await db.collection("games").findOne({ _id: ObjectId.createFromHexString(id) });
   }
   catch (err) {
       console.error("could not get game by id", err)
   }
   finally {
       if (client)
           client.close()
   }
}


export async function searchGameByName(name) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.MONGO_URI)
    const db = client.db(process.env.DB_NAME)

    
    const filter = name
      ? { name: { $regex: name, $options: 'i' } }
      : {}

    const games = await db.collection('games').find(filter).toArray()
    return games
  } catch (err) {
    console.error('could not get store games', err)
    throw err
  } finally {
    if (client) client.close()
  }
}



export async function getGameStorePage(id) {
  let client = null;
  try {
    const _id = typeof id === "string" ? new ObjectId(id) : id;

    client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    const games = db.collection("games");

    // current date
    let da = new Date();
    let day = da.getDate();
    let month = da.getMonth() + 1;
    let year = da.getFullYear();

    // build dynamic path for nested increment
    const path = `viewed.${year}.${month}.${day}`;

    // increment today's counter
    await games.updateOne(
      { _id },
      { $inc: { [path]: 1 } }
    );

    // return the game (separately)
    return await games.findOne({ _id });

  } catch (err) {
    console.error("could not get game by id", err);
    return null;
  } finally {
    if (client) await client.close();
  }
}


export async function getGameRequirementsById(gameId) {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db(process.env.DB_NAME);
  const games = db.collection("games");

  try {
    const game = await games.findOne(
      { _id: new ObjectId(gameId) },
      { projection: { _id: 1, name: 1, req: 1 } }
    );

    if (!game) throw new Error("Game not found");

    return {
      id: game._id,
      name: game.name,
      req: game.req
    };
  } finally {
    await client.close();
  }
}

export async function getHardwareDb() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db(process.env.DB_NAME);
  const benchmarks = db.collection("benchmarks");

  try {
    
    const catalog = await benchmarks.findOne(
      { cpus: { $exists: true }, gpus: { $exists: true } },
      {
        projection: { cpus: 1, gpus: 1, updatedAt: 1, schemaVersion: 1 },
        sort: { updatedAt: -1 }
      }
    );

    if (!catalog) throw new Error("Benchmark catalog not found");

    return catalog; 
  } finally {
    await client.close();
  }
}




export async function saveGameBenchmarkVerdict(gameId, hardware, verdict) {
  let client = null;
  try {
    const _id = typeof gameId === "string" ? new ObjectId(gameId) : gameId;

    client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    const benchmarks = db.collection("benchmarks");

    // current date
    const da = new Date();
    const day = da.getDate();
    const month = da.getMonth() + 1;
    const year = da.getFullYear();

    // build dynamic nested path for this date
    const path = `reqStats.${year}.${month}.${day}`;

    // sanitize & simplify data (anonymous)
    const hw = {
      cpuName: String(hardware?.cpuName || "").slice(0, 80),
      gpuName: String(hardware?.gpuName || "").slice(0, 80),
      vramGB: Number(hardware?.vramGB || 0),
      ramGB: Number(hardware?.ramGB || 0),
    };

    const v = {
      highest: verdict?.highest || "none",
      nextTier: verdict?.nextTier || "none",
      blockers: Array.isArray(verdict?.blockers)
        ? verdict.blockers.map(b => String(b.part || "").toUpperCase())
        : [],
    };

    // build increment object (like viewed.Y.M.D)
    const inc = {};
    inc[`${path}.total`] = 1;
    inc[`${path}.tiers.${v.highest}`] = 1;
    inc[`${path}.next.${v.nextTier}.total`] = 1;

    for (const part of v.blockers) {
      inc[`${path}.next.${v.nextTier}.blockers.${part}`] = 1;
    }

    // optional: RAM distribution for analytics
    const ramBucket =
      hw.ramGB >= 32 ? "32+" : hw.ramGB >= 16 ? "16-31" : "0-15";
    inc[`${path}.dist.ram.${ramBucket}`] = 1;

    // small rolling daily samples (last 200)
    const sample = {
      date: da,
      hw,
      v,
    };

    await benchmarks.updateOne(
      { kind: "reqStats", gameId: _id }, // use gameId field, not _id
      {
        $setOnInsert: {
          kind: "reqStats",
          gameId: _id,
          createdAt: da,
        },
        $inc: inc,
        $push: { [`${path}.samples`]: { $each: [sample], $slice: -200 } },
      },
      { upsert: true }
    );

    return { ok: true };
  } catch (err) {
    console.error("could not save game requirement verdict", err);
    return { ok: false, error: err.message };
  } finally {
    if (client) await client.close();
  }
}