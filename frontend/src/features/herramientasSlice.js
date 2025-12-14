import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import herramientasService from './herramientasService';

const initialState = {
    herramientas: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Crear nueva herramienta
export const crearHerramienta = createAsyncThunk(
    'herramientas/crear',
    async (herramientaData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await herramientasService.crearHerramienta(herramientaData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Obtener herramientas
export const obtenerHerramientas = createAsyncThunk(
    'herramientas/obtener',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await herramientasService.obtenerHerramientas(token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Obtener una herramienta por ID
export const obtenerUnaHerramienta = createAsyncThunk(
  'herramientas/obtenerUna', // Nombre de la acción interna de Redux
  async (id, thunkAPI) => {
    try {
      // Llama a la función del servicio (ver paso 2 abajo)
      return await herramientaService.obtenerUnaHerramienta(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Borrar herramienta
export const borrarHerramienta = createAsyncThunk(
    'herramientas/borrar',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            await herramientasService.borrarHerramienta(id, token);
            return id; // Retornamos el ID para borrarlo del estado local
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Actualizar herramienta (NUEVO)
export const actualizarHerramienta = createAsyncThunk(
    'herramientas/actualizar',
    async ({ id, herramientaData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await herramientasService.actualizarHerramienta(id, herramientaData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const herramientasSlice = createSlice({
    name: 'herramienta',
    initialState,
    reducers: {
        reset: (state) => initialState // Resetea todo el estado de herramientas
    },
    extraReducers: (builder) => {
        builder
            .addCase(crearHerramienta.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(crearHerramienta.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.herramientas.push(action.payload);
            })
            .addCase(crearHerramienta.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(obtenerHerramientas.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(obtenerHerramientas.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.herramientas = action.payload;
            })
            .addCase(obtenerHerramientas.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(borrarHerramienta.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.herramientas = state.herramientas.filter((h) => h._id !== action.payload);
            })
            // Cases para Actualizar (AGREGAR ESTO)
            .addCase(actualizarHerramienta.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(actualizarHerramienta.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Buscamos la herramienta vieja en el array y la reemplazamos por la nueva
                state.herramientas = state.herramientas.map((herramienta) =>
                    herramienta._id === action.payload._id ? action.payload : herramienta
                );
            })
            .addCase(actualizarHerramienta.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = herramientasSlice.actions;
export default herramientasSlice.reducer;