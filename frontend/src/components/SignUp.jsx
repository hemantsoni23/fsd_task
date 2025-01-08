import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { login } from "../redux/AuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignUp = ({ toggleAuthView }) => {
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;
      
    // Validation Rules
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{3,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
      const response = await axios.post(`${process.env.REACT_APP_API_ROUTE}/api/auth/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const {access_token} = response.data;
      Cookies.set("accessToken", access_token, { expires: 1 });
      dispatch(login(username));
      setError(null);
      Navigate("/dashboard");  
    } catch (error) {
      setError(error.response?.data?.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute top-2/3 right-3 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition duration-200 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-gray-600 text-sm text-center">
        Already have an account?{" "}
        <button onClick={toggleAuthView} className="text-blue-500 hover:underline">
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignUp;