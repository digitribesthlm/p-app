// pages/api/save-putting-data.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true
  });
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  console.log("API endpoint called");

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('putting');

    console.log("Data to be inserted:", req.body);

    const result = await collection.insertOne(req.body);
    console.log("Data inserted successfully:", result);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}