import React from 'react'
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { AvatarGroup } from "@mui/material";
import Avatar from '@material-ui/core/Avatar';

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Link } from "react-router-dom";
// Overview page components
import Header from "layouts/formation/components/Header";
import axios from 'axios';

// Data
import profilesListData from "layouts/formation/data/profilesListData";

// Images
import homeDecor1 from "assets/images/dojbxblb9ibp0fwfraap.webp";
import homeDecor2 from "assets/images/Nodejs-banner.jpeg";
import homeDecor3 from "assets/images/angular-core-in-depth-small.png";
import homeDecor4 from "assets/images/2842536_694c.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState,useEffect } from "react";
import {
  TextField,
  Button,
} from "@mui/material";

 const Formation = () => {
  const [formation,setFormations]= useState(null);  
  const id = localStorage.getItem('userId');

 

  const getFormations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/formation/getallform');
      const data = response.data;
      setFormations(data);
    } catch (error) {
      console.error("Error fetching formations:", error);
    }
  };
 
  useEffect(() => {
    getFormations();

  }, []);

  



const handleAddFormations = async (formationId) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/formation/postformation/${id}`,
      { formationIds: [formationId] }
    );

    const updatedUser = response.data.user;

    console.log("Updated User:", updatedUser);

    // update the formation state  so i don't  refresh the page  
    setFormations(prevFormations => {
      return prevFormations.map(formation => {
        if (formation._id === formationId) {
          return {
            ...formation,
            authors: [...formation.authors, { _id: id, profilePicture: updatedUser.profilePicture }]
          };
        }
        return formation;
      });
    });

  } catch (error) {
    console.error("Error:", error);
  }
};



  return (

    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
             Training
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
                Free courses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
          {formation && formation.map((formations) => (
 
              <Grid item xs={12} md={6} xl={3} key={formation._id}>
                <DefaultProjectCard
                  image={formations.image} 
                  label={formations.label}
                  title={formations.title}
                  desc={formations.desc}
                  description={formations.description}
                  action={{
                    type: 'internal',
                    route: '',
                    color: 'info',
                    label: 'Start Course',

                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                {formations.authors.some(
                (liker) =>
                  liker._id.toString() === id.toString()
              ) ? (
        <MDButton
          style={{ marginRight: '15px' }}
          variant="outlined"
          size="small"
          color="info"
          type="external"
          disabled
        >
          Already Added
        </MDButton>
      ) : (
        <MDButton
          style={{ marginRight: '15px' }}
          variant="outlined"
          size="small"
          color="info"
          type="external"
          onClick={() => handleAddFormations(formations._id)}
        >
          Add Course
        </MDButton>
      )}
      <div style={{ display: 'flex', gap: '-10px' }}>
        {formations.authors.map(authorId => (
          <Avatar
            key={authorId}
            style={{
              margin: 0,
              padding: 0,
              width: '30px',
              height: '30px',
            }}
            alt="Author"
            src={authorId.profilePicture}
          />
        ))}
      </div>
    </div>
  </Grid>
))}

          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>    )
}

export default Formation
