import mongoose, { mongo } from "mongoose"

import { MongoMemoryServer } from "mongodb-memory-server"

async function connect() {
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

     mongoose.set('strictQuery',true)
     const db = await mongoose.connect(getUri)
    console.log('Database connected');
    return db;
    
}


export default connect;