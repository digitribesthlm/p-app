import { MongoClient } from 'mongodb';

const fetchPuttingData = async (req, res) => {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db();
  const puttingData = await db.collection('putting').find({}).toArray();
  const puttingStats = await db.collection('putting_stats').find({}).toArray();
  client.close();
  res.status(200).json({ puttingData, puttingStats });
};

export default fetchPuttingData;
