import React, { useState, useEffect } from 'react';                                                                  
 import { useRouter } from 'next/router';                                                                             
 import Cookies from 'js-cookie';
 import ThemeSelector from '../components/ThemeSelector';
 import axios from 'axios';                                                                                           
                                                                                                                      
 const RoundDetails = () => {                                                                                         
   const router = useRouter();                                                                                        
   const { id } = router.query;                                                                                       
   const [roundData, setRoundData] = useState(null);                                                                  
                                                                                                                      
   useEffect(() => {                                                                                                  
     const token = Cookies.get('token');                                                                              
     if (!token) {                                                                                                    
       router.replace('/login');                                                                                      
     } else if (id) {                                                                                                 
       fetchRoundData(token, id);                                                                                     
     }                                                                                                                
   }, [id]);                                                                                                          
                                                                                                                      
   const fetchRoundData = async (token, roundId) => {                                                                 
     try {                                                                                                            
       const response = await axios.get(`/api/get-round-details?id=${roundId}`, {                                     
         headers: {                                                                                                   
           Authorization: `Bearer ${token}`,                                                                          
         },                                                                                                           
       });                                                                                                            
       setRoundData(response.data);                                                                                   
     } catch (error) {                                                                                                
       console.error('Error fetching round data:', error);                                                            
     }                                                                                                                
   };                                                                                                                 
                                                                                                                      
   if (!roundData) {                                                                                                  
     return <div>Loading...</div>;                                                                                    
   }                                                                                                                  
                                                                                                                      
   return (                                                                                                           
     <div className="container mx-auto p-4">                                                                          
       <h1 className="text-2xl font-bold mb-4">Round Details</h1>
       <ThemeSelector />
       <div className="overflow-x-auto">                                                                              
         <table className="table table-compact w-full">                                                               
           <thead>                                                                                                    
             <tr>                                                                                                     
               <th className="w-20">Hole</th>                                                                         
               <th className="w-20">Putt</th>                                                                         
               <th className="w-20">Length</th>                                                                       
               <th className="w-20">Length Category</th>                                                              
               <th className="w-20 bg-gray-100">Level</th>                                                            
               <th className="w-20 bg-gray-100">Outcome</th>                                                          
               <th className="w-20 bg-yellow-100">Prepp</th>                                                          
               <th className="w-20 bg-yellow-100">Read</th>                                                           
               <th className="w-20 bg-yellow-100">Speed</th>                                                          
               <th className="w-20 bg-yellow-100">Stroke</th>                                                         
               <th className="w-20 bg-yellow-100">Mental</th>                                                         
             </tr>                                                                                                    
           </thead>                                                                                                   
           <tbody>                                                                                                    
             {roundData.holes.map((hole) =>                                                                           
               hole.putts.map((putt, puttIndex) => (                                                                  
                 <tr key={`${hole.hole_number}-${puttIndex}`}>                                                        
                   <td className="w-20">{hole.hole_number}</td>                                                       
                   <td className="w-20">{puttIndex + 1}</td>                                                          
                   <td className="w-20">{putt.length}</td>                                                            
                   <td className="w-20">{putt.length_category}</td>                                                   
                   <td className="w-20 bg-gray-100">{putt.level}</td>                                                 
                   <td className="w-20 bg-gray-100">{putt.outcome}</td>                                               
                   <td className="w-20 bg-yellow-100">{putt.prepp}</td>                                               
                   <td className="w-20 bg-yellow-100">{putt.read}</td>                                                
                   <td className="w-20 bg-yellow-100">{putt.speed}</td>                                               
                   <td className="w-20 bg-yellow-100">{putt.stroke}</td>                                              
                   <td className="w-20 bg-yellow-100">{putt.mental}</td>                                              
                 </tr>                                                                                                
               ))                                                                                                     
             )}                                                                                                       
           </tbody>                                                                                                   
         </table>                                                                                                     
       </div>                                                                                                         
     </div>                                                                                                           
   );                                                                                                                 
 };                                                                                                                   
                                                                                                                      
 export default RoundDetails;
