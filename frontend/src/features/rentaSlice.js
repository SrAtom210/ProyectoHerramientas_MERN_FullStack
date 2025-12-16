import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rentaService from './rentaService';

// ✅ 1. ESTADO INICIAL AMPLIADO
const initialState = {
  rentas: [],          // Lo que yo renté (Mis Rentas)
  clientes: [],        // Quién me rentó a mí (Mis Clientes)
  recomendaciones: [], // Sugerencias del sistema
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- THUNKS (ACCIONES ASÍNCRONAS) ---

// 1. Crear nueva renta
export const crearRenta = createAsyncThunk(
  'rentas/crear',
  async (rentaData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.crearRenta(rentaData, token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. Obtener mis rentas (Lo que yo debo)
export const obtenerMisRentas = createAsyncThunk(
  'rentas/obtenerMias',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.obtenerMisRentas(token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. ✅ NUEVO: Obtener mis clientes (Ventas)
export const obtenerClientes = createAsyncThunk(
  'rentas/obtenerClientes',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.obtenerClientes(token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4. ✅ NUEVO: Cancelar / Devolver renta
export const cancelarRenta = createAsyncThunk(
  'rentas/cancelar',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.cancelarRenta(id, token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5. ✅ NUEVO: Obtener recomendaciones
export const obtenerRecomendaciones = createAsyncThunk(
  'rentas/recomendaciones',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.obtenerRecomendaciones(token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rentaSlice = createSlice({
  name: 'renta',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- CREAR RENTA ---
      .addCase(crearRenta.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(crearRenta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rentas.push(action.payload);
      })
      .addCase(crearRenta.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- OBTENER MIS RENTAS ---
      .addCase(obtenerMisRentas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(obtenerMisRentas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rentas = action.payload;
      })
      .addCase(obtenerMisRentas.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- OBTENER CLIENTES (NUEVO) ---
      .addCase(obtenerClientes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(obtenerClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes = action.payload; // Guardamos en el array de clientes
      })
      .addCase(obtenerClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- CANCELAR/DEVOLVER (NUEVO) ---
      .addCase(cancelarRenta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Quitamos la renta devuelta de la lista localmente para que desaparezca al instante
        state.rentas = state.rentas.filter((renta) => renta._id !== action.payload.id);
      })
      .addCase(cancelarRenta.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- RECOMENDACIONES (NUEVO) ---
      .addCase(obtenerRecomendaciones.fulfilled, (state, action) => {
        state.recomendaciones = action.payload;
      });
  },
});

export const { reset } = rentaSlice.actions;
export default rentaSlice.reducer;