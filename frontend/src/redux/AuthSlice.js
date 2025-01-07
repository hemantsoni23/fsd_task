import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: false,
    username: null,
    status: 'idle',
  },
  reducers: {
    login: (state, action) => {
      state.authToken = true;
      state.username = action.payload;
    },
    logout: (state) => {
      Cookies.remove('accessToken');
      state.authToken = false;
      state.username = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;