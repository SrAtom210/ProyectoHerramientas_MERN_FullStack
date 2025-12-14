import { configureStore } from '@reduxjs/toolkit';
//import authReducer from '../features/authSlice';            // ✅ Corregido a ../features
//import herramientasReducer from '../features/herramientasSlice'; // ✅ Corregido a ../features
//import rentasReducer from '../features/rentaSlice';         // ✅ Corregido a ../features


import authReducer from './features/authSlice';            // ✅ Corregido a ../features
import herramientasReducer from './features/herramientasSlice'; // ✅ Corregido a ../features
import rentasReducer from './features/rentaSlice';         // ✅ Corregido a ../features

export const store = configureStore({
  reducer: {
    auth: authReducer,
    herramientas: herramientasReducer,
    rentas: rentasReducer, // ✅ Agregamos el reducer de rentas
  },
});

