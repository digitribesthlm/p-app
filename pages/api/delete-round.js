import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

function getUserEmailFromToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired');
      // You might want to trigger a token refresh here or handle it in your frontend
    } else {
      console.error('Error decoding token:', error);
    }
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header
    const email = getUserEmailFromToken(token);
    
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Round ID is required' });
    }

    try {
      const { db } = await connectToDatabase();
      const collectionName = process.env.MONGODB_COLLECTION;
      const collection = db.collection(collectionName);

      // Make sure the user owns this round before deleting it
      const result = await collection.deleteOne({ _id: id, user: email });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Round not found or not owned by user' });
      }

      return res.status(200).json({ message: 'Round deleted successfully' });
    } catch (error) {
      console.error('Error deleting round:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}