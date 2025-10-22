import { MongoClient, ObjectId } from "mongodb";
import DB from "../DB/db.model.js";





export async function addUserToDB(User) {
    let db = new DB();
    try {
        User.email = User.email.toLowerCase();
        let resp = await db.addDoc("users", User);
        console.log("user added to db", resp);
        delete User.pass
        User._id = resp.insertedId;
        return User;

    } catch (err) {
        console.error("user wasnt able to be added", err)
    }


}

export async function isUserExistsById(id) {
    let db = new DB()

    try {

        return await db.getDocById("users", id, { projection: { _id: 1, role: 1 } })

    }
    catch (err) {
        console.error("could not find user", err)
    }

}

export async function isUsernameTaken(username) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({ username: username }, { projection: { username: 1 } })
    }
    catch (err) {
        console.error("username wasnt found", err)
    }
    finally {
        if (client)
            client.close()
    }
}

export async function isEmailTaken(email) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        email = email.toLowerCase()
        return await db.collection("users").findOne({ email: email }, { projection: { email: 1, _id: 0 } })
    }
    catch (err) {
        console.error("email wasnt found", err)
    }
    finally {
        if (client)
            client.close()
    }
}

export async function LoginToUser(email, role) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        email = email.toLowerCase();
        const filter = { email: email};
        let resp = await db.collection("users").findOne(filter, { projection: { email: 1, pass: 1, username: 1 ,role:1} });
        console.log("login db resp", resp)


        return resp;

    }
    catch (err) {

        console.error("user wasnt found", err)
    }
    finally {
        if (client)
            client.close();
    }
}

export async function updateUserEmail(id, email) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        email = email.toLowerCase();
        await db.collection("users").findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { email: email } })

    }
    catch (err) {
        console.error("user wasnt able to be updated", err)
    }
    finally {
        if (client)
            client.close()
    }
}

export async function getPassById(id) {
    let client = null
    try {
        client = MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({ _id: ObjectId.createFromHexString(id) }, { projection: { password: 1, role: 1, _id: 0 } })
    }
    catch (err) {
        console.error("password wasnt found", err)

    }
    finally {
        if (client)
            client.close()
    }
}

export async function updateUsername(id, username) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { username: username } }, { returnDocument: "after" })
    }
    catch (err) {
        console.error("username wasnt able to be updated", err)
    }
    finally {
        if (client)
            client.close()
    }
}

export async function getUserById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        let resp = await db.collection("users").findOne({_id: ObjectId.cacheHexString(id)}, 
        { projection: { email: 1, pass: 1, username: 1 } });
        return resp;
    }
    catch (err) {
        console.error("user wasnt found", err)
    }
    finally {
        if (client)
            client.close();
    }
}


export async function findUserByEmail(email) {
    let client = null;
    try {
      client = await MongoClient.connect(process.env.MONGO_URI);
      const db = client.db(process.env.DB_NAME);
  
      // we want to return enough fields for login (password hash, id, role)
      let res = await db.collection("users").findOne(
        { email },
        { projection: { email: 1, username: 1, role: 1, pass: 1 } }
      );
      console.log("findUserByEmail res", res)
      return res
    } catch (err) {
      console.error("findUserByEmail error:", err);
      return null;
    } finally {
      if (client)
         client.close();
    }
  }





export async function addToUserWishlist(userId, gameId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        let user = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!user) {
            console.error("user not found");
            return null;
        }
        if (!user.wishlist) {
            user.wishlist = [];
        }
        if (user.wishlist.includes(gameId)) {
            console.error("game already in wishlist");
            return "exists";
        }
        let da = new Date()
        let date = `${da.getDate()}/${da.getMonth() + 1}/${da.getFullYear()}`
        let res =user.wishlist.push(gameId);
        await db.collection("users").updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $push: { wishlist: { gameId: gameId, addDate: date } } })
        return res;
    }
    catch (err) {
        console.error("could not add game to wishlist", err);
        return null;
    }
    finally {
        if (client)
            client.close();
    }
}



export async function getUserWishlist(userId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.DB_NAME);

        const user = await db.collection("users").findOne(
            { _id: ObjectId.createFromHexString(userId) },
            { projection: { wishlist: 1 } }
        );
        
        if (!user) {
            console.error("user not found");
            return null; 
        }
       
        
        return Array.isArray(user.wishlist) ? user.wishlist : [];
    } catch (err) {
        console.error("could not get user wishlist", err);
        return null;
    } finally {
        if (client) await client.close();
    }
}


export async function removeFromUserWishlist(userId, gameId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        const res = await db.collection("users").updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $pull: { wishlist: { gameId: gameId } } }
        );

        // return 1 if something was removed, 0 otherwise
        return res.modifiedCount > 0 ? 1 : 0;
    }
    catch (err) {
        console.error("could not remove game from wishlist", err);
        return null;
    }
    finally {
        if (client)
            client.close();
    }
}


export async function isGameInUserWishlist(userId, gameId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        const user = await db.collection("users").findOne(
            { _id: ObjectId.createFromHexString(userId), "wishlist.gameId": gameId },
            { projection: { _id: 1 } }
        );
        return user ? true : false;
    }
    catch (err) {
        console.error("could not check game in wishlist", err);
        return null;
    }
    finally {
        if (client)
            client.close();
    }
}


export async function addToUserLibary(userId, gameId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        let user = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!user) {
            console.error("user not found");
            return null;
        }
        if (!user.library) {
            user.library = [];
        }
        if (user.library.includes(gameId)) {
            console.error("game already in library");
            return "exists";
        }
        let da = new Date()
        let date = `${da.getDate()}/${da.getMonth() + 1}/${da.getFullYear()}`
        let res =user.library.push(gameId);
        await db.collection("users").updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $push: { library: { gameId: gameId, addDate: date } } })
        await db.collection("games").updateOne(
            { _id: ObjectId.createFromHexString(gameId) },
            { $inc: { purchases: 1 } })
        await db.collection("users").updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $pull: { wishlist: { gameId: gameId } } })
        return res;
    }
    catch (err) {
        console.error("could not add game to library", err);
        return null;
    }
    finally {
        if (client)
            client.close();
    }
}

export async function getUserLibary(userId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.DB_NAME);
        const user = await db.collection("users").findOne(
            { _id: ObjectId.createFromHexString(userId) },
            { projection: { library: 1 } }
        );
        if (!user) {
            console.error("user not found");
            return null; 
        }
        return Array.isArray(user.library) ? user.library : [];
    } catch (err) {
        console.error("could not get user library", err);
        return null;
    } finally {
        if (client) await client.close();
    }
}