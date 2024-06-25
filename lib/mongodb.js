import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'putting_app'; // Specify your database name here

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export async function connectToDatabase() {
  const client = new MongoClient(uri, {
    // Add these options if you're connecting to Atlas
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  try {
    console.log('Connecting to MongoDB at:', uri);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}