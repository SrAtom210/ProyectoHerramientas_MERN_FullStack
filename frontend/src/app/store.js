import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import herramientasReducer from './features/herramientasSlice'; // <--- IMPORTAR

export const store = configureStore({
    reducer: {
        auth: authReducer,
        herramientas: herramientasReducer // <--- AGREGAR
    },
});