/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import React, { useState,useEffect } from 'react'

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { toast } from "react-toastify";

function Cover() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    file: null, // To store the uploaded file
    
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, file: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = "http://localhost:8000/api/auth/"; 

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("file", formData.file); 

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signed up successfully!");
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  

 




  return (
    <CoverLayout image={bgImage}>
    <Card>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        mt={-3}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Join us today
        </MDTypography>
        <MDTypography display="block" variant="button" color="white" my={1}>
          Enter your email and password to register
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <form onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="First Name"
              variant="standard"
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </MDBox>
       
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Last Name"
              variant="standard"
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="email"
              label="Email"
              variant="standard"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="phone"
              label="phone"
              variant="standard"
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="password"
              label="Password"
              variant="standard"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox mb={2}>
            {/* File input field */}
            <input type="file" name="file" onChange={handleFileChange} />
          </MDBox>

          {/* <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={handleImageUpload}>Upload Image</button>
 */}

        
          <MDBox display="flex" alignItems="center" ml={-1}>
            <Checkbox />
            <MDTypography
              variant="button"
              fontWeight="regular"
              color="text"
              sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
            >
              &nbsp;&nbsp;I agree the&nbsp;
            </MDTypography>
            <MDTypography
              component="a"
              href="#"
              variant="button"
              fontWeight="bold"
              color="info"
              textGradient
            >
              Terms and Conditions
            </MDTypography>
          </MDBox>
          <MDBox mt={4} mb={1}>
            <MDButton type="submit" variant="gradient" color="info" fullWidth>
              Sign Up
            </MDButton>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              Already have an account?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign In
              </MDTypography>
            </MDTypography>
          </MDBox>
        </form>
      </MDBox>
    </Card>
  </CoverLayout>
  );
}

export default Cover;
