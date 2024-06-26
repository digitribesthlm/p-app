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
                                                                                          
     console.log('Fetching users...');                                                    
     const users = await db.collection('users').find({}).toArray();                       
     console.log('Fetched users:', users);                                                
                                                                                          
     return {                                                                             
       props: {                                                                           
         users: JSON.parse(JSON.stringify(users)),                                        
         error: null,                                                                     
       },                                                                                 
     };                                                                                   
   } catch (error) {                                                                      
     console.error('Error fetching users:', error);                                       
     return {                                                                             
       props: {                                                                           
         users: [],                                                                       
         error: 'An error occurred while fetching users. Please check the server logs for more details.',                                                                          
       },                                                                                 
     };                                                                                   
   }                                                                                      
 }                                                                                        
                                                                                          
 export default UsersPage;   
