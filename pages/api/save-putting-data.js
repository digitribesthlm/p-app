// pages/api/save-putting-data.js
import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { course, holes, statistics } = req.body;

    if (!course || !holes || !statistics) {
      return res.status(400).json({ error: 'Missing required fields!' });
    }

    try {
      const { db } = await connectToDatabase();
      const collectionName = process.env.MONGODB_COLLECTION;
      const collection = db.collection(collectionName);

      const token = req.headers.authorization?.replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const user = await collection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userEmail = user.email;

      const newPuttingData = {
        course,
        holes,
        statistics,
        user: userEmail,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newPuttingData);

      // Use insertedId instead of ops
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
