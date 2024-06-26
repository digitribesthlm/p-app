import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { course, holes, statistics } = req.body;

    if (!course || !holes || !statistics) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { db } = await connectToDatabase();
      const collectionName = process.env.MONGODB_COLLECTION;
      const collection = db.collection(collectionName);
      
      // Get the token from the request headers
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify and decode the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // Find the user in the database using the userId
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const newPuttingData = {
        course,
        holes,
        statistics,
        createdAt: new Date(),
        user: user.email,
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
