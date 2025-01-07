import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const accessToken = Cookies.get("accessToken");
  return accessToken ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;