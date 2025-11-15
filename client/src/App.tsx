import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";
import {Navbar} from "./components/navbar";
import { useAuth } from "./context/authContext";
import SignInPage from "./pages/signin";
import SignUpPage from "./pages/signup";
import {DashboardPage} from "./pages/dashboard";
import { ToastProvider } from "./context/toastContext";
import ForgotPasswordPage from "./pages/forgotPass";

export const App = () => {
  // const { setUser } = useAuth();

//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   const user = localStorage.getItem("user");
   
//   if (token && user) {
//     setUser(JSON.parse(user));
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   }
// }, []);

  return (
    <ToastProvider>
    <Container
      maxWidth={false}
      disableGutters
      sx={{width: "100vw",height : "100dvh",margin : 0,padding :0}}
      >
      <Navbar />
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    </Container>
    </ToastProvider>
  );
};