import { MongoClient } from 'mongodb';

const db_database = process.env.MONGODB_DB;
const uri = process.env.MONGODB_URI;

export async function connectToDatabase() {
  if (!uri) {
    console.error('MongoDB URI is not defined in environment variables');
    throw new Error('MongoDB URI is not defined');
  }

  const client = new MongoClient(uri);

  try {
    console.log('MongoDB URI successfully retrieved from environment variables');
    console.log('Connecting to MongoDB...'); // General log without exposing the URI
    await client.connect();
    console.log('Successfully connected to MongoDB'); // Confirm successful connection
    const db = client.db(db_database);
    return { client, db };
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}
