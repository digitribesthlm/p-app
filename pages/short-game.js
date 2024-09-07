import React from 'react';                              
import ShortGameForm from '../components/ShortGameForm' 
                                                        
const ShortGamePage = () => {                           
  return (                                              
    <div className="container mx-auto p-4">             
      <h1 className="text-2xl font-bold mb-4">Short Gam 
Tracker</h1>                                            
      <ShortGameForm />                                 
    </div>                                              
  );                                                    
};                                                      
                                                        
export default ShortGamePage;