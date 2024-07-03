// pages/api/save-putting-data.js
import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

function getUserEmailFromToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired');
      return null;
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token:', error);
      return null;
    }
    return null;
  }
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    const email = getUserEmailFromToken(token);

    if (!email) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    

    const { course, holes, statistics } = req.body;

    if (!course || !holes || !statistics) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { db } = await connectToDatabase();
      const collectionName = process.env.MONGODB_COLLECTION;
      const collection = db.collection(collectionName);

      const newPuttingData = {
        course,
        holes,
        statistics,
        user: email,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newPuttingData);

      // Use insertedId to fetch the inserted document
      const insertedDocument = await collection.findOne({ _id: result.insertedId });

      return res.status(201).json({ message: 'Putting data saved', data: insertedDocument });
    } catch (error) {
      console.error('Error saving putting data:', error.message, error.stack);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
