import { connectToDatabase } from '../../lib/mongodb';                                                               
 import jwt from 'jsonwebtoken';                                                                                      
                                                                                                                      
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
                                                                                                                      
     if (!email) {                                                                                                    
       return res.status(401).json({ error: 'Unauthorized' });                                                        
     }                                                                                                                
                                                                                                                      
     try {                                                                                                            
       const { db } = await connectToDatabase();                                                                      
       const collectionName = process.env.MONGODB_COLLECTION;                                                         
       const collection = db.collection(collectionName);                                                              
                                                                                                                      
       const puttingData = await collection.find({ user: email }).toArray();                                          
                                                                                                                      
       return res.status(200).json(puttingData);                                                                      
     } catch (error) {                                                                                                
       console.error('Error fetching putting data:', error);                                                          
       return res.status(500).json({ error: 'Internal Server Error' });                                               
     }                                                                                                                
   } else {                                                                                                           
     res.setHeader('Allow', ['GET']);                                                                                 
     res.status(405).end(`Method ${req.method} Not Allowed`);                                                         
   }                                                                                                                  
 }; 