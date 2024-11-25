import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, TextField, Box, Button, Alert } from "@mui/material";
import axios from "axios";
import styles from "./Login.module.css";
import { getCookie } from '../utils/utils';
import { useSnackbar } from 'notistack';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ username: false, password: false });
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = process.env.REACT_APP_API_URL;


  const handleLogin = async () => {
    if (!username || !password) {
      setError({
        username: !username,
        password: !password,
      });
      return;
    }
    if (username === 'licadmin24') {
      localStorage.setItem('userRole', 'admin');
    } else {
      localStorage.setItem('userRole', 'staff');
    }
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(`${API_URL}/api/login-admin/`, {
        username,
        password,
      }, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
      });

      if (response.data.status === "success") {
        localStorage.setItem('token', response.data.token); // Save the token
        enqueueSnackbar('Logged in successful!', { variant: 'success' });
        navigate(`/dashboard/${username}`);
      } else {
        // Show custom error message in the Snackbar
        enqueueSnackbar('Login failed', { variant: 'error' });
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Check for specific error messages
      if (error.response) {
        // Handle different types of errors
        if (error.response.data.username) {
            enqueueSnackbar('Username not found', { variant: 'error' }); // Username not found
        } else if (error.response.data.non_field_errors) {
           enqueueSnackbar('Invalid credentials', { variant: 'error' }); // Invalid credentials
        } else {
          enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' }); // Generic error
        }
    } else {
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('images/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      <img
        src="images/lrac_logo-removebg-preview.png"
        alt="logo"
        style={{
          position: "absolute",
          top: "30px",
          left: "10%",
          height: "50px",
        }}
      />
      <Paper
        elevation={4}
        sx={{
          padding: 3,
          maxWidth: 350,
          borderRadius: 2,
          height: 300,
        }}
      >
        <h2 className={styles.loginHeader} style={{ fontWeight: "bolder" }}>
          <span style={{ color: "#FFD404" }}>LIC</span>{" "}
          <span style={{ color: "#A83332" }}>Connect</span>
        </h2>

        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          fullWidth
          onChange={(e) => {
            setUsername(e.target.value);
            setError((prev) => ({ ...prev, username: false }));
          }}
          sx={{ mb: 2 }}
          required
          error={error.username}
          helperText={error.username && "Username is required"}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError((prev) => ({ ...prev, password: false }));
          }}
          required
          error={error.password}
          helperText={error.password && "Password is required"}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            backgroundColor: "#A83332",
          }}
        >
          <strong>Login</strong>
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;