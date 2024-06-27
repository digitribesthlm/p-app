import React, { useState, useEffect } from 'react';                                                                  
 import { useRouter } from 'next/router';                                                                             
 import Cookies from 'js-cookie';                                                                                     
 import axios from 'axios';                                                                                           
                                                                                                                      
 const Statistics = () => {                                                                                           
   const router = useRouter();                                                                                        
   const [puttingData, setPuttingData] = useState([]);                                                                
                                                                                                                      
   useEffect(() => {                                                                                                  
     const token = Cookies.get('token');                                                                              
     if (!token) {                                                                                                    
       router.replace('/login');                                                                                      
     } else {                                                                                                         
       fetchPuttingData(token);                                                                                       
     }                                                                                                                
   }, []);                                                                                                            
                                                                                                                      
   const fetchPuttingData = async (token) => {                                                                        
     try {                                                                                                            
       const response = await axios.get('/api/get-putting-data', {                                                    
         headers: {                                                                                                   
           Authorization: `Bearer ${token}`,                                                                          
         },                                                                                                           
       });                                                                                                            
       setPuttingData(response.data);                                                                                 
     } catch (error) {                                                                                                
       console.error('Error fetching putting data:', error);                                                          
     }                                                                                                                
   };                                                                                                                 
                                                                                                                      
   const handleRoundClick = (roundId) => {                                                                            
     router.push(`/round-details?id=${roundId}`);                                                                     
   };                                                                                                                 
                                                                                                                      
   return (                                                                                                           
     <div className="container mx-auto p-4">                                                                          
       <h1 className="text-2xl font-bold mb-4">Putting Statistics</h1>                                                
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                                         
         {puttingData.map((round) => (                                                                                
           <div                                                                                                       
             key={round._id}                                                                                          
             className="card bg-base-100 shadow-xl cursor-pointer"                                                    
             onClick={() => handleRoundClick(round._id)}                                                              
           >                                                                                                          
             <div className="card-body">                                                                              
               <h2 className="card-title">{round.course}</h2>                                                         
               <p className="text-sm">{new Date(round.createdAt).toLocaleDateString()}</p>                            
               <div className="flex justify-between items-center">                                                    
                 <div>                                                                                                
                   <p>1 Putts: {round.statistics.one_putts}</p>                                                       
                   <p>2 Putts: {round.statistics.two_putts}</p>                                                       
                   <p>3 Putts: {round.statistics.three_putts}</p>                                                     
                 </div>                                                                                               
                 <div className="text-4xl font-bold">{round.statistics.total_putts}</div>                             
               </div>                                                                                                 
             </div>                                                                                                   
           </div>                                                                                                     
         ))}                                                                                                          
       </div>                                                                                                         
     </div>                                                                                                           
   );                                                                                                                 
 };                                                                                                                   
                                                                                                                      
 export default Statistics; 