import { configureStore } from '@reduxjs/toolkit';
import authReducer from './merkmale/authSlice';
import herramientasReducer from './merkmale/herramientasSlice'; // <--- IMPORTAR

export const store = configureStore({
    reducer: {
        auth: authReducer,
        herramientas: herramientasReducer // <--- AGREGAR
    },
});