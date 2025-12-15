import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rentaService from './rentaService';

const initialState = {
  rentas: [],       // Lo que yo renté
  clientes: [],     // ✅ NUEVO: Gente que me rentó a mí
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Crear nueva renta
export const crearRenta = createAsyncThunk(
  'rentas/crear',
  async (rentaData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.crearRenta(rentaData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Obtener mis rentas
export const obtenerMisRentas = createAsyncThunk(
  'rentas/obtenerMias',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.obtenerMisRentas(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ NUEVO: Cancelar / Devolver renta
export const cancelarRenta = createAsyncThunk(
  'rentas/cancelar',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rentaService.cancelarRenta(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ NUEVO THUNK: Obtener Clientes
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
      
      // --- OBTENER RENTAS ---
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

      // --- ✅ NUEVO: CANCELAR RENTA ---
      .addCase(cancelarRenta.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelarRenta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Filtramos la renta eliminada del estado local para que desaparezca instantáneamente
        // (Asumiendo que el backend devuelve { id: "..." })
        state.rentas = state.rentas.filter((renta) => renta._id !== action.payload.id);
      })
      .addCase(cancelarRenta.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(obtenerClientes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(obtenerClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes = action.payload; // Guardamos en el array 'clientes'
      })
      .addCase(obtenerClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = rentaSlice.actions;
export default rentaSlice.reducer;