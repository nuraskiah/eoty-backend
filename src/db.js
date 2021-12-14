const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.MONGO_URL);

exports.dbConnect = async () => {
  await client.connect();
};

exports.db = (dbName = "eoty") => {
  const db = client.db(dbName);
  return db;
};
