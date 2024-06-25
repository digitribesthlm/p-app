import { MongoClient } from 'mongodb';

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://paal01:§password@cluster0.65l1huq.mongodb.net/myapp';

export async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('Connecting to MongoDB at:', uri); // Helps to verify the URI in logs
    await client.connect();
    console.log('Successfully connected to MongoDB'); // Confirm successful connection
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}
