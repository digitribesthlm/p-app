import { MongoClient } from 'mongodb';


const db_database = process.env.MONGODB_DB;

const uri = process.env.MONGODB_URI;

export async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('Connecting to MongoDB at:', uri); // Helps to verify the URI in logs
    await client.connect();
    console.log('Successfully connected to MongoDB'); // Confirm successful connection
    const db = client.db(db_database);
    return { client, db };
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}
