import React from 'react'
// @mui material components
import Grid from "@mui/material/Grid";
import Avatar from '@material-ui/core/Avatar';
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
import { Link, Navigate } from "react-router-dom";
// Overview page components
import Header from "layouts/formation/components/Header";
import axios from 'axios';

import RatingComponent from './components/RatingComponent';
// Data

import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Notfound } from 'layouts/Notfound/Notfound';

 const Formation = () => {
  const [formation,setFormations]= useState(null);  

  const id = localStorage.getItem('userId');

  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  
  const user = JSON.parse(localStorage.getItem("user"));

  


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

  

  const LoadingSpinner = () => {
    return (
      <div className="loading-spinner">
      </div>
    );
  };
  


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

const handleRateFormation = async (formationId, rating) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/formation/rate/${formationId}`,
      { rating }
    );

    const { averageRating } = response.data;

    // Update the formation state to reflect the new average rating
    setFormations(prevFormations => {
      return prevFormations.map(formation => {
        if (formation._id === formationId) {
          return {
            ...formation,
            averageRating
          };
        }
        return formation;
      });
    });

  } catch (error) {
    console.error("Error rating formation:", error);
  }
};

const hasEmployeeRole = roles.some(role => role.name === "employee");

useEffect(() => {
  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/getuser/${id}`);
      const data = await response.json();
      setRoles(data.Roles);


    } catch (error) {
      console.error('Error fetching user data:', error);
    }

      if (user) {
        navigate("/dashboard/formation", { replace: true });
      } else if (!user) {
        navigate("/authentication/sign-in", { replace: true });
      }
  };

  getUser();
}, [id,Navigate]);

if (!formation) {
  return <LoadingSpinner />;
}

return hasEmployeeRole ? (

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
                <RatingComponent
          formationId={formations._id}
          averageRating={formations.averageRating}
          onRate={rating => handleRateFormation(formations._id, rating)}
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
    </DashboardLayout>    
    ) : (

      <Notfound/>
    );
}

export default Formation
