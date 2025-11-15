import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useThemeMode } from "../context/themeModeContext";
import { useToast } from "../context/toastContext";
import { Loader } from "../common/loader";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PasswordInput from "../common/passwordInput";

function SignInPage() {
  const { signin, user } = useAuth();
  const { mode } = useThemeMode();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!password.trim()) {
      showToast("Password is required", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await signin(email, password);
      showToast("Signed in successfully", "success");
      navigate("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Sign in failed", "error");
      console.log(err)
    } finally {
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
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required
            />

            <PasswordInput value={password} onChange={(e: any) => setPassword(e.target.value)} />

            <Typography
              variant="body2"
              sx={{
                textAlign: "right",
                mb: 2,
                cursor: "pointer",
                color: "primary.main",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: "bold",
                textTransform: "none",
                height: 48,
              }}
            >
              {loading ? <Loader size={22} /> : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignInPage;
