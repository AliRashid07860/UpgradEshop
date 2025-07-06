// src/components/Auth/Signup/Signup.jsx
import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../../common/api"; // API helper
import "./Signup.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // ✅ added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber
    ) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      setError("Contact number must be a 10-digit number.");
      return;
    }

    try {
      const response = await post("/auth/signup", {
        firstName,
        lastName,
        username, // ✅ include username
        email,
        password,
        contactNumber,
        role: ["user"],
      });

      if (response && response.message === "User created successfully") {
        setSuccess("Signup successful! Please login.");
        navigate("/login");
      } else {
        setError(
          response.message || "Signup failed: Invalid response from server."
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred during signup.");
      }
    }
  };

  return (
    <div className="signup-container">
      <Paper elevation={3} className="signup-paper">
        <Typography variant="h5" component="h1" className="signup-title">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" className="signup-alert">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="signup-alert">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            margin="normal"
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="signup-button"
          >
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" className="signup-login-text">
          Already have an account?{" "}
          <Link to="/login" className="signup-login-link">
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Signup;
