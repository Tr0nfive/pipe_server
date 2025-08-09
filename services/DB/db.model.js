
import { MongoClient, ObjectId } from 'mongodb';
import { writeLogDB } from '../../middleware/log.js';


export default class DB {

    client = null;
    db = null;


    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI)
        this.db = process.env.DB_NAME
    }

  


    async addDoc(collection, doc) {
        try {
            await this.client?.connect()
           return await this.client.db(this.db).collection(collection).insertOne({ doc })
        } catch (error) {
            writeLogDB(error, { func: 'addDoc', collc: collection, doc: doc })
            console.log('error', error)
        }
        finally {
            await this.client?.close()
        }
    }

    async addDocuments(collection, docs, projection = {}) {
        try {
            await this.client?.connect()
            return await this.client.db(this.db).collection(collection).insertMany({ docs }, { projection: projection })
        }
        catch (error) {
            let data = { func: 'addDocuments', collc: collection, docs: docs, projection: projection }
            writeLogDB(error, data)
            console.log('error', error)
        }
        finally {
            await this.client?.close()
        }
    }

    async getDocById(collection, id, projection = {}) {
        try {
            await this.client?.connect()
            return await this.client.db(this.db).collection(collection).findOne({ _id: ObjectId.createFromHexString(id) }, { projection: projection })
        }
        catch (error) {
            let data = { func: 'getDocById', collc: collection, id: id, projection: projection }
            writeLogDB(error, data)
            console.log('error', error);
        }
        finally {
            await this.client?.close()
        }
    }

    async getDocuments(collection, filter = {}, projection = {}) {
        try {
            await this.client?.connect()
            return await this.client.db(this.db).collection(collection).find({ filter }, { projection }).toArray()
        }
        catch (error) {
            writeLogDB(error, { func: 'getDocuments', collc: collection, filter: filter, projection: projection })
            console.log('error', error)
        }
        finally {
            await this.client?.close()
        }
    }

    async updateDoc(collection, id, updateData) {
        try {
            await this.client?.connect();
            return await this.client.db(this.db).collection(collection).updateOne(
                { _id: ObjectId.createFromHexString(id) },
                { $set: updateData }
            );
        } catch (error) {
            writeLogDB(error, { func: 'updateDoc', collc: collection, id: id, updateData: updateData });
            console.log('error', error);
        } finally {
            await this.client?.close();
        }
    }

    async updateDocuments(collection, filter = {}, updateData) {
        try {
            await this.client?.connect();
            return await this.client.db(this.db).collection(collection).updateMany(
                filter,
                { $set: updateData }
            );
        } catch (error) {
            writeLogDB(error, { func: 'updateDocuments', collc: collection, filter: filter, updateData: updateData });
            console.log('error', error);
        } finally {
            await this.client?.close();
        }
    }

    async deleteDoc(collection, id) {
        try {
            await this.client?.connect();
            return await this.client.db(this.db).collection(collection).updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { deleted: 1 } });
        } catch (error) {
            writeLogDB(error, { func: 'deleteDoc', collc: collection, id: id });
            console.log('error', error);
        } finally {
            await this.client?.close();
        }
    }
    async deleteDocuments(collection, filter = {}) {
        try {
            await this.client?.connect();
            return await this.client.db(this.db).collection(collection).deleteMany(filter);
        } catch (error) {
            writeLogDB(error, { func: 'deleteDocuments', collc: collection, filter: filter });
            console.log('error', error);
        } finally {
            await this.client?.close();
        }
    }

    async aggregate(collection, pipeline) {
        try {
            await this.client?.connect();
            return await this.client.db(this.db).collection(collection).aggregate(pipeline).toArray();
        } catch (error) {
            writeLogDB(error, { func: 'aggregate', collc: collection, pipeline: pipeline });
            console.log('error', error);
        } finally {
            await this.client?.close();
        }
    }


}