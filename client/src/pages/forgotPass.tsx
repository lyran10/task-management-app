import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useThemeMode } from "../context/themeModeContext";
import { useToast } from "../context/toastContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "../common/loader";
import { useAuth } from "../context/authContext";
import PasswordInput from "../common/passwordInput";

const API_BASE = import.meta.env.VITE_API_URL;

function ResetPasswordPage() {
  const { user } = useAuth()
  const { mode } = useThemeMode();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(user) navigate("/dashboard")
    },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showToast("Enter a valid email address", "error");
      return;
    }

    if (!newPassword.trim()) {
      showToast("New password is required", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/auth/reset-password`, {
        email,
        newPassword,
      });

      showToast("Password reset successfully!", "success");
      navigate("/");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to reset password","error");
    }finally {
     setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "90%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: mode === "light" ? "whitesmoke" : "",
      }}
    >
      <Container maxWidth={false}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 6,
            width: "100%",
            maxWidth: 400,
            mx: "auto",
            backgroundColor: mode === "light" ? "#fff" : "",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Reset Password
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <PasswordInput value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} />

            <PasswordInput id={"confirmPassword"} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.1,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {loading ? <Loader size={22} /> : "Reset Password"}
            </Button>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textAlign: "center",
                cursor: "pointer",
                color: "primary.main",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/")}
            >
              Back to Sign In
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPasswordPage;
