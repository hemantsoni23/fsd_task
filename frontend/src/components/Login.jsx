import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { login } from "../redux/AuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = ({ toggleAuthView }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = credentials;

    // Validation Rules
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{3,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;  
      
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!usernameRegex.test(username)) {
        setError(
        "Username must be at least 3 characters, contain only letters, numbers, dots, or underscores, and cannot start/end with dots."
        );
        return;
    }
    if (!passwordRegex.test(password)) {
        setError(
        "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character."
        );
        return;
    }
      
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_ROUTE}/api/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const {access_token} = response.data;
      Cookies.set("accessToken", access_token);
      setError(null);
      dispatch(login(username));
      Navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Username"
            autoComplete="username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-gray-600 text-sm text-center">
        Don't have an account?{" "}
        <button onClick={toggleAuthView} className="text-blue-500 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;