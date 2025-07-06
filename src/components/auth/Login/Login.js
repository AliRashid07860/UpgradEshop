// src/components/auth/Login.jsx

import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../../common/api"; // API helper
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      // 🔄 backend expects "username" instead of "email"
      const response = await post("/auth/signin", {
        username: email, // 'username' field backend expect karta hai
        password: password,
      });

      if (response && response.token) {
        localStorage.setItem("x-auth-token", response.token);
        localStorage.setItem("userRole", response.role || "user");
        setSuccess("Login successful! Redirecting...");
        navigate("/products");
        window.location.reload(); // Refresh to update auth state
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" component="h1" className="login-title">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="login-alert">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="login-alert">
            {success}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" className="login-signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="login-signup-link">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
