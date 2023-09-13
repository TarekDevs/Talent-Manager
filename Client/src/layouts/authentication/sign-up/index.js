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
import axios from "axios"; 

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

function Cover() {
  const [profilePictureUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
      // Initialize your form data
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      file: null, // Assuming you are using this to upload CV
      profilePicture: null, // Profile picture file
      isHR: false, 
    isEmployee: false, 
    });
  

    const handleInputChange = (event) => {
      const { name, value, type, checked } = event.target;
  
      if (name === 'isHR') {
        setFormData({ isHR: checked, isEmployee: !checked });
      } else if (name === 'isEmployee') {
        setFormData({ isHR: !checked, isEmployee: checked });
      }
    };

  const handleFileChange = (event) => {
    setFormData({ ...formData, file: event.target.files[0] });
  };
  const [avatar, setAvatar] = useState(null);

  const handleImageClick = (e) => {
    const profilePicture = e.target.files[0];
    setFormData({ ...formData, profilePicture });
    setAvatar(profilePicture);

  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dxououehj/upload';
    const cloudinaryPreset = 'siwarse'; // Your Cloudinary preset

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.profilePicture);
    formDataToSend.append('upload_preset', cloudinaryPreset);

    try {
      const cloudinaryResponse = await axios.post(cloudinaryUrl, formDataToSend);
      const profilePictureUrl = cloudinaryResponse.data.secure_url;

      // Your existing form data
      const userFormData = new FormData();
      userFormData.append('firstName', formData.firstName);
      userFormData.append('lastName', formData.lastName);
      userFormData.append('email', formData.email);
      userFormData.append('phone', formData.phone);
      userFormData.append('password', formData.password);
      userFormData.append('file', formData.file);
      userFormData.append('profilePicture', profilePictureUrl); // Use the Cloudinary URL

      if (formData.isHR) {
        userFormData.append('roleId', '64ca9bda320ef3d3bb184e1f');
      }

      // Check if Employee checkbox is checked and add Employee roleId if true
      if (formData.isEmployee) {
        userFormData.append('roleId', '64ca9bda320ef3d3bb184e20');
      }

      


      const url = 'http://localhost:8000/api/auth/';
      const response = await axios.post(url, userFormData);

      if (response.status === 200) {
        alert('Signed up successfully!');
      } else {
        console.error('Registration failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };



  return (
    <CoverLayout image={bgImage}>
    <Card style={{marginBottom:"20px"}}>
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
            <input type="file" name="file" onChange={handleFileChange} />
          </MDBox>
         
         <div style={{ display: 'flex', alignItems: 'center' }}>
  {avatar ? (
    <img
      src={URL.createObjectURL(avatar)}
      alt="avatar"
      style={{
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        border: '0px solid #ccc',
      }}
    />
  ) : (
    <RxAvatar
      style={{
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        marginRight: '10px',
        color:'#7b809a'
      }}
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={handleImageClick}
    style={{ marginLeft: '10px' }} 
  />
</div>

<MDBox mb={2} style={{marginTop:'20px'}}>
  <Checkbox
    name="isAdmin"
    checked={formData.isHR}
    onChange={handleInputChange}
  />
  <MDTypography
    variant="button"
    fontWeight="regular"
    color="text"
    sx={{
      cursor: "pointer",
      userSelect: "none",
      ml: -1,
    }}
  >
    Register as HR
  </MDTypography>
  <Checkbox
    name="isEmployee"
    checked={formData.isEmployee}
    onChange={handleInputChange}
    style={{marginLeft:"90px"}}
  />
  <MDTypography
    variant="button"
    fontWeight="regular"
    color="text"
    sx={{
      cursor: "pointer",
      userSelect: "none",
      ml: -1,
    }}
  >
    Register as Employee
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
