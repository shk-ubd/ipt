import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutsContexProvider } from './context/context';
import { AuthContextProvider } from './context/authcontext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthContextProvider>
   <WorkoutsContexProvider>
    <BrowserRouter>
     <App />
    </BrowserRouter>
   </WorkoutsContexProvider>
  </AuthContextProvider>
  </React.StrictMode>
);
