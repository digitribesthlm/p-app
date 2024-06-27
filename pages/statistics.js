import React, { useState, useEffect } from 'react';                                                                  
import { useRouter } from 'next/router';                                                                             
import Cookies from 'js-cookie';                                                                                     import axios from 'axios';                                                                                           
                                                                                                                      
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
                                                                                                                      
   const countPutts = (holes) => {                                                                                    
     const puttsCount = {                                                                                             
       one: 0,                                                                                                        
       two: 0,                                                                                                        
       three: 0,                                                                                                      
       total: 0,                                                                                                      
     };                                                                                                               
                                                                                                                      
     holes.forEach((hole) => {                                                                                        
       const numPutts = hole.putts.length;                                                                            
       puttsCount.total += numPutts;                                                                                  
                                                                                                                      
       if (numPutts === 1) {                                                                                          
         puttsCount.one += 1;                                                                                         
       } else if (numPutts === 2) {                                                                                   
         puttsCount.two += 1;                                                                                         
       } else if (numPutts >= 3) {                                                                                    
         puttsCount.three += 1;                                                                                       
       }                                                                                                              
     });                                                                                                              
                                                                                                                      
     return puttsCount;                                                                                               
   };                                                                                                                 
                                                                                                                      
   const calculateTotalMeters = (holes) => {                                                                          
     let totalLastPuttsMeters = 0;                                                                                    
     let totalAllPuttsMeters = 0;                                                                                     
                                                                                                                      
     holes.forEach((hole) => {                                                                                        
       const putts = hole.putts;                                                                                      
       const lastPutt = putts[putts.length - 1];                                                                      
       totalLastPuttsMeters += parseFloat(lastPutt.length);                                                           
                                                                                                                      
       putts.forEach((putt) => {                                                                                      
         totalAllPuttsMeters += parseFloat(putt.length);                                                              
       });                                                                                                            
     });                                                                                                              
                                                                                                                      
     return {                                                                                                         
       totalLastPuttsMeters: Math.round(totalLastPuttsMeters),                                                        
       totalAllPuttsMeters: Math.round(totalAllPuttsMeters),                                                          
     };                                                                                                               
   };                                                                                                                 
                                                                                                                      
   return (                                                                                                           
     <div className="container mx-auto p-4">                                                                          
       <h1 className="text-2xl font-bold mb-4">Putting Statistics</h1>                                                
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                                         
         {puttingData.map((round) => {                                                                                
           const puttsCount = countPutts(round.holes);                                                                
           const { totalLastPuttsMeters, totalAllPuttsMeters } = calculateTotalMeters(round.holes);                   
           const makePercent = `${((totalLastPuttsMeters / totalAllPuttsMeters) * 100).toFixed(0)}%`;                                                                                               
           return (                                                                                                   
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
                     <p>1 Putts: {puttsCount.one}</p>                                                                 
                     <p>2 Putts: {puttsCount.two}</p>                                                                 
                     <p>3+ Putts: {puttsCount.three}</p>                                                              
                     <p>Last Putts: {totalLastPuttsMeters} m ({makePercent}) | Total: {totalAllPuttsMeters} m</p>                        
                                                      
                   </div>                                                                                             
                   <div className="text-6xl font-bold">                                                               
                     {puttsCount.total}                                                                               
                   </div>                                                                                             
                 </div>                                                                                               
               </div>                                                                                                 
             </div>                                                                                                   
           );                                                                                                         
         })}                                                                                                          
       </div>                                                                                                         
     </div>                                                                                                           
   );                                                                                                                 
 };                                                                                                                   
                                                                                                                      
 export default Statistics; 