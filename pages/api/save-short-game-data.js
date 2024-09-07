import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('short_game');
      await collection.insertOne(data);

      res.status(201).json({ message: 'Short game data saved successfully' });
    } catch (error) {
      console.error('Error saving short game data:', error);
      res.status(500).json({ message: 'An error occurred while saving short game data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
