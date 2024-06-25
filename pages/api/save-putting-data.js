// pages/api/save-putting-data.js
import { connectToDatabase } from '../../lib/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { course, holes, statistics } = req.body;

    if (!course || !holes || !statistics) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('putting');

      const newPuttingData = {
        course,
        holes,
        statistics,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newPuttingData);

      return res.status(201).json({ message: 'Putting data saved', data: result.ops[0] });
    } catch (error) {
      console.error('Error saving putting data:', error.message, error.stack);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
