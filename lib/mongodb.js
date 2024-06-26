import { MongoClient } from 'mongodb';

const db_database = process.env.MONGODB_DB;
const uri = process.env.MONGODB_URI;

export async function connectToDatabase() {
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB at:', uri);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    const db = client.db(db_database);
    return { client, db };
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}