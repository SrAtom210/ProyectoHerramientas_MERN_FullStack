import { configureStore } from '@reduxjs/toolkit';


import authReducer from './features/authSlice';            
import herramientasReducer from './features/herramientasSlice'; 
import rentasReducer from './features/rentaSlice';         

export const store = configureStore({
  reducer: {
    auth: authReducer,
    herramientas: herramientasReducer,
    rentas: rentasReducer, 
  },
});

