import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        console.error('User not found for email:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Direct comparison for plain text passwords
      const isPasswordValid = password === user.password;

      if (!isPasswordValid) {
        console.error('Invalid password for user:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error.message, error.stack);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};