import { createSlice } from '@reduxjs/toolkit';

const storedAuthToken = localStorage.getItem('authToken');
const storedUsername = localStorage.getItem('username');
const storedTheme = localStorage.getItem('theme') || 'light';

if (storedTheme === 'dark') {
  document.body.classList.add('dark');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: storedAuthToken || null,
    username: storedUsername || null,
    theme: storedTheme,
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
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';

      if (state.theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }

      localStorage.setItem('theme', state.theme);
    },
  },
});

export const { login, logout, toggleTheme } = authSlice.actions;
export default authSlice.reducer;
