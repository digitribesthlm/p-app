import React from 'react';                                                               
 import { connectToDatabase } from '../lib/mongodb';                                      
                                                                                          
 const UsersPage = ({ users, error }) => {                                                
   return (                                                                               
     <div className="container mx-auto p-4">                                              
       <h1 className="text-2xl font-bold mb-4">Users</h1>                                 
       {error ? (                                                                         
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
           <p>{error}</p>                                                                 
         </div>                                                                           
       ) : users.length === 0 ? (                                                         
         <p>No users found.</p>                                                           
       ) : (                                                                              
         <table className="table-auto">                                                   
           <thead>                                                                        
             <tr>                                                                         
               <th className="px-4 py-2">Email</th>                                       
               <th className="px-4 py-2">Password</th>                                    
             </tr>                                                                        
           </thead>                                                                       
           <tbody>                                                                        
             {users.map((user, index) => (                                                
               <tr key={index}>                                                           
                 <td className="border px-4 py-2">{user.email}</td>                       
                 <td className="border px-4 py-2">{user.password}</td>                    
               </tr>                                                                      
             ))}                                                                          
           </tbody>                                                                       
         </table>                                                                         
       )}                                                                                 
     </div>                                                                               
   );                                                                                     
 };                                                                                       
                                                                                          
 export async function getServerSideProps() {
    try {
      console.log('Connecting to database...');
      const { db } = await connectToDatabase();
      console.log('Connected to database');
  
      // List all collections
      console.log('Listing all collections:');
      const collections = await db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
  
      // Check if 'users' collection exists super
      if (!collections.some(c => c.name === 'users')) {
        throw new Error("'users' collection does not exist in the database");
      }
  
      console.log('Accessing users collection...');
      const usersCollection = db.collection('users');
  
      console.log('Counting documents in users collection...');
      const count = await usersCollection.countDocuments();
      console.log(`Number of documents in users collection: ${count}`);
  
      console.log('Fetching users...');
      const users = await usersCollection.find({}).toArray();
      console.log(`Fetched ${users.length} users`);
  
      // Log a sample user (first user) if any exist
      if (users.length > 0) {
        console.log('Sample user:', JSON.stringify(users[0], null, 2));
      }
  
      return {
        props: {
          users: JSON.parse(JSON.stringify(users)),
          error: null,
        },
      };
    } catch (error) {
      console.error('Error details:', error);
      return {
        props: {
          users: [],
          error: `Error fetching users: ${error.message}`,
        },
      };
    }
  }                                                                                    
                                                                                          
 export default UsersPage; 