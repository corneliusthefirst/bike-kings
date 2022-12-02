import { getLoggedInUser } from '../../helpers/authUtils';
import { createSlice } from '@reduxjs/toolkit';
import { forgetPassword, login, logout, register } from './async-functions';

const initialState = {
    user: getLoggedInUser(),
    loading: false,
    error: null
};

const authSlicie = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      apiError: (state, action) => {
        return { ...state, error: action.payload };
      },
      default: (state, action) => {
        return state;
      }
    },
    extraReducers: builder => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state = { ...state, user: action.payload, loading: false, error: null };
      }).addCase(login.rejected, (state, action) => {
        state = { ...state, user: null, loading: false, error: action.payload };
      })
      .addCase(logout.pending, (state, action) => {
        state.loading = true
      }).addCase(logout.fulfilled, (state, action) => {
        state = { ...state, user: null, loading: false, error: null };
      }).addCase(logout.rejected, (state, action) => {
        state = { ...state, loading: false, error: action.payload };
      }).addCase(register.pending, (state, action) => {
        state.loading = true
      }).addCase(register.fulfilled, (state, action) => {
        state = { ...state, user: action.payload, loading: false, error: null };
      }).addCase(register.rejected, (state, action) => {
        state = { ...state, user: null, loading: false, error: action.payload };
      })
      .addCase(forgetPassword.pending, (state, action) => {
        state.loading = true
      }).addCase(forgetPassword.fulfilled, (state, action) => {
        state = { ...state, passwordResetStatus: action.payload, loading: false, error: null };
      }).addCase(forgetPassword.rejected, (state, action) => {
        state = { ...state, passwordResetStatus: null, loading: false, error: action.payload };
      })
  }
});

export const { apiError } = authSlicie.actions

export default authSlicie.reducer