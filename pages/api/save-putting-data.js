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
      const usersCollection = db.collection('users');
      const puttingDataCollection = db.collection('putting');

      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const userId = decodedToken.userId;

      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newPuttingData = {
        course,
        holes,
        statistics,
        userId: new ObjectId(userId),
        userEmail: user.email,
        createdAt: new Date(),
      };

      const result = await puttingDataCollection.insertOne(newPuttingData);
      const insertedDocument = await puttingDataCollection.findOne({ _id: result.insertedId });

      return res.status(201).json({ message: 'Putting data saved', data: insertedDocument });
    } catch (error) {
      console.error('Error saving putting data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}