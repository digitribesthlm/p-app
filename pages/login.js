import React, { useState } from 'react';                                                 
 import axios from 'axios';                                                               
 import Cookies from 'js-cookie';                                                         
 import { useRouter } from 'next/router';                                                 
                                                                                          
 const Login = () => {                                                                    
   const [email, setEmail] = useState('');                                                
   const [password, setPassword] = useState('');                                          
   const [error, setError] = useState('');                                                
   const router = useRouter();                                                            
                                                                                          
   const handleSubmit = async (e) => {                                                    
     e.preventDefault();                                                                  
                                                                                          
     try {                                                                                
       const response = await axios.post('/api/login', { email, password });              
       Cookies.set('token', response.data.token);                                         
       router.push('/');                                                                  
     } catch (error) {                                                                    
       setError(error.response.data.error);                                               
     }                                                                                    
   };                                                                                     
                                                                                          
   return (                                                                               
     <div className="container mx-auto p-4">                                              
       <h1 className="text-2xl font-bold mb-4">Login</h1>                                 
       {error && <p className="text-red-500">{error}</p>}                                 
       <form onSubmit={handleSubmit}>                                                     
         <div className="mb-4">                                                           
           <label htmlFor="email" className="block text-sm font-medium                    
 text-gray-700">Email</label>                                                             
           <input                                                                         
             type="email"                                                                 
             id="email"                                                                   
             value={email}                                                                
             onChange={(e) => setEmail(e.target.value)}                                   
             className="input input-bordered w-full"                                      
           />                                                                             
         </div>                                                                           
         <div className="mb-4">                                                           
           <label htmlFor="password" className="block text-sm font-medium                 
 text-gray-700">Password</label>                                                          
           <input                                                                         
             type="password"                                                              
             id="password"                                                                
             value={password}                                                             
             onChange={(e) => setPassword(e.target.value)}                                
             className="input input-bordered w-full"                                      
           />                                                                             
         </div>                                                                           
         <button type="submit" className="btn btn-primary">Login</button>                 
       </form>                                                                            
     </div>                                                                               
   );                                                                                     
 };                                                                                       
                                                                                          
 export default Login;    