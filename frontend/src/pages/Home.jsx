import React, { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthView = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="home-page grid grid-cols-1 md:grid-cols-2 min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Full stack Developer assignment - HS</h1>
      </div>
      <div className="flex justify-center items-center bg-white p-8">
        {isLogin ? <Login toggleAuthView={toggleAuthView} /> : <SignUp toggleAuthView={toggleAuthView} />}
      </div>
    </div>
  );
};

export default Home;