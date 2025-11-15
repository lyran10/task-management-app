import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useThemeMode } from "../context/themeModeContext";
import { useToast } from "../context/toastContext";
import { Loader } from "../common/loader";
import PasswordInput from "../common/passwordInput";

const SignUpPage = () => {
  const { signup, user } = useAuth();
  const {mode} = useThemeMode()
  const navigate = useNavigate();
  const {showToast} = useToast()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(user) navigate("/dashboard")
    },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    if (!email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email", "error");
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
      await signup(name, email, password);
      showToast("Signed up successfully", "success");
      navigate("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Sign up failed", "error");
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
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }} elevation={6}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          
          <PasswordInput value={password} onChange={(e: any) => setPassword(e.target.value)} />

          <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          disabled={loading}>
            {loading ? <Loader size={22} /> : "Sign Up"}
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Button variant="text" component={Link} to="/">
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
