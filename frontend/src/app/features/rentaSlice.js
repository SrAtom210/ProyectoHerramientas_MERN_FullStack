import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rentaService from './rentaService';

// 1. ESTADO INICIAL
const initialState = {
  rentas: [],
  clientes: [],
  recomendaciones: [], // <--- Asegúrate de tener esto
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- THUNKS ---

// 1. Crear renta
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

// 2. Obtener mis rentas
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

// 3. Obtener clientes
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

// 4. Cancelar renta
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

// 5. ✅ ESTA ES LA QUE TE FALTABA O ESTABA MAL COPIADA
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
      // Crear
      .addCase(crearRenta.pending, (state) => { state.isLoading = true; })
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
      // Obtener Mias
      .addCase(obtenerMisRentas.pending, (state) => { state.isLoading = true; })
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
      // Clientes
      .addCase(obtenerClientes.pending, (state) => { state.isLoading = true; })
      .addCase(obtenerClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes = action.payload;
      })
      .addCase(obtenerClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancelar
      .addCase(cancelarRenta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rentas = state.rentas.filter((renta) => renta._id !== action.payload.id);
      })
      // ✅ RECOMENDACIONES (Asegúrate de tener este caso también)
      .addCase(obtenerRecomendaciones.fulfilled, (state, action) => {
        state.recomendaciones = action.payload;
      });
  },
});

export const { reset } = rentaSlice.actions;
export default rentaSlice.reducer;