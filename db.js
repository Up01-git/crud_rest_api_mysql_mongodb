const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";

const dbName = "tododb";

const client = new MongoClient(url);

async function dbConnect() {
    let result = await client.connect();
    db = result.db(dbName);

    return db.collection('list1');

}

module.exports = dbConnect;