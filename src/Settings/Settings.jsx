import React, { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { Container, TextField } from "@mui/material";
import axios from "axios";
import Header from '../Components/Header.jsx';
import { useSnackbar } from 'notistack';
import "./Settings.css";

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  //State to store form values
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //Handle reset button click
  const handleReset = () => {
    //Clear all form values
    setFormValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  //Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  // Handle password change
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formValues;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put("https://lic-backend-f65697da89f2.herokuapp.com/api/change-password/", 
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        enqueueSnackbar('Password changed successfully!', { variant: 'success' });
        setErrorMessage("");
        handleReset(); // Clear form fields after successful change
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "Error changing password. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <>
    <Header></Header>
      <div className="containerSettings">
        <Sheet variant="plain" className="sheet" sx={{
          background: 'rgba(0, 0, 0, 0)'
        }}>
          {/* Header Section */}
          
          <Container maxWidth="sm" className="passwordForm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Change Password
              </Typography>
              {errorMessage && <Typography sx={{ color: 'red', mt: 2 }}>{errorMessage}</Typography>}
              {successMessage && <Typography color="success">{successMessage}</Typography>}
              <TextField
                label="Current Password"
                variant="outlined"
                type="password"
                name="currentPassword"
                value={formValues.currentPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                name="newPassword"
                value={formValues.newPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  width: "auto",
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    mt: 2,
                    color: "#89343B",
                    "&:hover": {
                      backgroundColor: "#FFD000",
                      color: "white",
                    },
                  }}
                  onClick={handleReset}
                >
                  Reset
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleChangePassword}
                  sx={{
                    mt: 2,
                    backgroundColor: "#89343B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#b04049",
                    },
                  }}
                >
                  Change
                </Button>
              </Box>
            </Box>
          </Container>
        </Sheet>
      </div>

      {/* Change Password Form */}
    </>
  );
};

export default Settings;