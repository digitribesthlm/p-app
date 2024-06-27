import { connectToDatabase } from '../../lib/mongodb';                                                               
 import jwt from 'jsonwebtoken';                                                                                      
 import { ObjectId } from 'mongodb';                                                                                  
                                                                                                                      
 function getUserEmailFromToken(token) {                                                                              
   try {                                                                                                              
     const decoded = jwt.verify(token, process.env.JWT_SECRET);                                                       
     return decoded.email;                                                                                            
   } catch (error) {                                                                                                  
     console.error('Error decoding token:', error);                                                                   
     return null;                                                                                                     
   }                                                                                                                  
 }                                                                                                                    
                                                                                                                      
 export default async (req, res) => {                                                                                 
   if (req.method === 'GET') {                                                                                        
     const token = req.headers.authorization?.split(' ')[1];                                                          
     const email = getUserEmailFromToken(token);                                                                      
     const roundId = req.query.id;                                                                                    
                                                                                                                      
     if (!email) {                                                                                                    
       return res.status(401).json({ error: 'Unauthorized' });                                                        
     }                                                                                                                
                                                                                                                      
     try {                                                                                                            
       const { db } = await connectToDatabase();                                                                      
       const collectionName = process.env.MONGODB_COLLECTION;                                                         
       const collection = db.collection(collectionName);                                                              
                                                                                                                      
       const roundData = await collection.findOne({ _id: new ObjectId(roundId), user: email });                       
                                                                                                                      
       if (!roundData) {                                                                                              
         return res.status(404).json({ error: 'Round not found' });                                                   
       }                                                                                                              
                                                                                                                      
       return res.status(200).json(roundData);                                                                        
     } catch (error) {                                                                                                
       console.error('Error fetching round data:', error);                                                            
       return res.status(500).json({ error: 'Internal Server Error' });                                               
     }                                                                                                                
   } else {                                                                                                           
     res.setHeader('Allow', ['GET']);                                                                                 
     res.status(405).end(`Method ${req.method} Not Allowed`);                                                         
   }                                                                                                                  
 };  