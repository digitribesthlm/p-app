import { connectToDatabase } from '../../lib/mongodb';                                   
 import bcrypt from 'bcryptjs';                                                           
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
         return res.status(401).json({ error: 'Invalid email or password' });             
       }                                                                                  
                                                                                          
       const isPasswordValid = await bcrypt.compare(password, user.password);             
                                                                                          
       if (!isPasswordValid) {                                                            
         return res.status(401).json({ error: 'Invalid email or password' });             
       }                                                                                  
                                                                                          
       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn:  
 '1h' });                                                                                 
                                                                                          
       return res.status(200).json({ token });                                            
     } catch (error) {                                                                    
       console.error('Error logging in:', error.message, error.stack);                    
       return res.status(500).json({ error: 'Internal Server Error' });                   
     }                                                                                    
   } else {                                                                               
     res.setHeader('Allow', ['POST']);                                                    
     res.status(405).end(`Method ${req.method} Not Allowed`);                             
   }                                                                                      
 };import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
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
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
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
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
