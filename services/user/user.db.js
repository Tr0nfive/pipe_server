import { MongoClient, ObjectId } from "mongodb";
import DB from "../DB/db.model.js";





export async function addUserToDB(User) {
    let db = new DB();
    try {
        User.email = User.email.toLowerCase();
        let resp = await db.addDoc("users",User );
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
       
       return await db.getDocById("users",id,{projection:{ _id: 1,role:1 }})

    }
    catch (err) {
        console.error("could not find user", err)
    }
    
}

export async function isUsernameTaken(username){
    let client = null;
    try{
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({username:username},{projection:{username:1}})
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
        client = await MongoClient.connect(process.env.MONGO_URI)
        let  db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({email:email},{projection:{email:1,_id:0}})
    }
    catch(err){
        console.error("email wasnt found",err)
    }
    finally{
        if(client)
            client.close()
    }
}

export async function LoginToUser(email, role) {
   let client = null;
   try{
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        email = email.toLowerCase();
        const filter = { email: email, role: role };
        let resp = await db.collection("users").findOne(filter, { projection: { email:1 , pass:1, username:1} });
        console.log("login db resp", resp)
        
        
        return resp;
        
    }
    catch (err) {   

        console.error("user wasnt found", err)
    }
    finally{
        if(client)
        client.close();
    }
}

export async function updateUserEmail(id,email){
    let client = null
    try{
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        await db.collection("users").findOneAndUpdate({_id: ObjectId.createFromHexString(id)},{ $set:{email:email}})

    }
    catch(err){
        console.error("user wasnt able to be updated",err)
    }
    finally{
        if(client)
            client.close()
    }
}

export async function getPassById(id){
    let client = null
    try{
        client = MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOne({_id: ObjectId.createFromHexString(id)},{projection:{password:1,role:1,_id:0}})
    }
    catch(err){
        console.error("password wasnt found",err)

    }
    finally{
        if(client)
            client.close()
    }
}

export async function updateUsername(id,username){
    let client = null
    try{
        client = await MongoClient.connect(process.env.MONGO_URI)
        let db = client.db(process.env.DB_NAME)
        return await db.collection("users").findOneAndUpdate({_id: ObjectId.createFromHexString(id)},{ $set:{username:username}},{returnDocument:"after"})
    }
    catch(err){
        console.error("username wasnt able to be updated",err)
    }
    finally{
        if(client)
            client.close()
    }
}


export async function getGamesStore() {
    let client = null;
    try{
        client = await MongoClient.connect(process.env.MONGO_URI);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("games").find({}).toArray();
    }
    catch(err){
        console.error("could not get store games",err)
    }
    finally{
        if(client)
            client.close()
    }
}

