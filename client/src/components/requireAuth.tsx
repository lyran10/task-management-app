import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { JSX } from "@emotion/react/jsx-runtime";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/signin" replace />;
};

export default RequireAuth;