import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcryptjs'







export async function findAllUsers() {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        return await db.collection("users").find().toArray();
    }
    catch (err) {
        console.error("Error finding users", err)
    }
    finally {
        if (client)
            client.close();
    }

}

export async function findUserById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        return await db.collection("users").findOne({ _id: new ObjectId(id) });
    }
    catch (err) {
        console.error("Error finding users", err)
    }
    finally {
        if (client)
            client.close();
    }


}

export async function addUserToDB(User) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        await db.collection("users").insertOne(User);

    } catch (err) {
        console.error("user wasnt able to be added", err)
    }
    finally {
        if (client)
            client.close();
    }

}

export async function isUserExistsById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("users").findOne({ _id: new ObjectId(id) })

    }
    catch (err) {
        console.error("could not find user", err)
    }
    finally {
        if (client)
            client.close();

    }
}

export async function isUsernameTaken(username){
    let client = null;
    try{
        client = await MongoClient.connect(process.env.CONNECTION_STRING)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({username:username})
    }
    catch(err){
        console.error("username wasnt found",err)
    }
    finally{
        if(client)
            client.close()
    }
}

export async function isEmailTaken(email){
    let client = null
    try{
        client = await MongoClient.connect(process.env.CONNECTION_STRING)
        let  db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({email:email})
    }
    catch(err){
        console.error("email wasnt found",err)
    }
    finally{
        if(client)
            client.close()
    }
}

export async function LoginToUser(email, pass, role) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = await client.db(process.env.DB_NAME);

        await db.collection("users").findOne({ email: email, role: role }).then(user => {
            if (user) {
                bcrypt.compareSync(pass, user.pass, (err, result) => {
                    if (result)
                        return user
                    if (err)
                        console.error("password didnt match", err)
                })
            }
        })
    }
    catch (err) {

        console.error("user wasnt found", err)
    }
    finally{
        if(client)
        client.close();
    }
}

