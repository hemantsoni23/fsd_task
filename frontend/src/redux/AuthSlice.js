import { createSlice } from '@reduxjs/toolkit';

const storedAuthToken = localStorage.getItem('authToken');
const storedUsername = localStorage.getItem('username')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: storedAuthToken || null,
    username: storedUsername || null,
    status: 'idle',
  },
  reducers: {
    login: (state, action) => {
      state.authToken = action.payload.authToken;
      state.username = action.payload.username;
      localStorage.setItem('authToken', state.authToken);
      localStorage.setItem('username', state.username);
    },
    logout: (state) => {
      state.authToken = null;
      state.username = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;