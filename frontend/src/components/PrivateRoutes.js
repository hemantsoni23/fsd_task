import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const accessToken = useSelector((state) => state.auth.authToken);
  return accessToken ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;