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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Link } from "react-router-dom";
// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState,useEffect } from "react";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'; 
import {
  TextField,
  Button,
} from "@mui/material";
import axios from "axios"; 
function Overview() {

  const id = localStorage.getItem('userId');
  const [user,setUser]= useState(null);  
  const [open, setOpen] = useState(false); 
  const [profileInformation, setProfileInformation] = useState("");
  const [diplome, setDiplome] = useState("");

//modal
  const handleOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };


//getuserinformation
  const getUser = async()=>{
    const response = await fetch (`http://localhost:8000/api/users/getuser/${id}` , {
    method:"GET",

    });

    const data = await response.json();
    setUser(data);
    setProfileInformation(data.ProfileInformation)
    setDiplome(data.diplome)
    
};


useEffect(()=>{
    getUser();
    
},[]);


if(!user) return null ;


const{
  firstName,
  lastName,
  email, 
  phone,
  cv,
  
  
}=user;


//handleupdateuser 
const handleSave = () => {
  const updatedProfile = {
    firstName,
    lastName,
    phone,
    email,
    ProfileInformation: profileInformation,
    diplome: diplome,
  };

  axios
    .put(`http://localhost:8000/api/users/UpdateUser/${id}`, updatedProfile)
    .then((response) => {
      console.log(response);

      setUser((prevUser) => ({
        ...prevUser,
        ProfileInformation: profileInformation,
        diplome :diplome,
      }));

      handleClose();

    })
    .catch((error) => {
      console.error(error);
    });
};









  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />

              <ProfileInfoCard
                title="profile information"
                description= ""
                user={user} // Pass the user data as a prop

                info={{
                  fullName:firstName,
                  lastName:lastName,
                  mobile: phone,
                  email: email,
                  // profileInformation: user.ProfileInformation, // Use the updated profile information
                
                
                  CV: (
                   
                    <a
                      href={`http://localhost:8000/api/users/cv/${encodeURIComponent(cv)}`}
                      download
                      style={{width:"15px", color:"gray",}}
                    >
                      <CloudDownloadIcon  style={{width:"15px", color:"gray",fontSize:32}}/>    Download CV 
                    </a>
                 
                    ),  
                    diplome: user.diplome,
                    
                  }}               
                social={[
               
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                handleOpen={handleOpen}

                shadow={false}
                
              />
            </Grid>
           
          </Grid>
        <Modal
        open={open}
        onClose={handleClose}
       
      >
        <Fade in={open}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "80%",
                maxWidth: "600px",
                padding: "20px",
                background: "#fff",
              }}
            >
              <MDTypography variant="h5" fontWeight="medium">
              Full Name: {firstName} {lastName} 
              </MDTypography> 
              <MDTypography variant="h5" fontWeight="medium">
              Email: {email} 
              </MDTypography>           
              <MDTypography variant="h5" fontWeight="medium">
             Phone : {phone} 
              </MDTypography>
              <MDTypography variant="h5" fontWeight="medium">
              Profile Information :
                        <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={profileInformation}
                onChange={(e) => setProfileInformation(e.target.value)}
              /> </MDTypography>   
               <MDTypography variant="h5" fontWeight="medium">
              Diplome:
                        <TextField
                variant="outlined"
                fullWidth
                value={diplome}
                onChange={(e) => setDiplome(e.target.value)}
              /></MDTypography>    
              <Button  style ={{marginLeft:'380px',marginTop:"20px",color:"#344767"}}onClick={handleSave} >
                Save
              </Button>
              <Button   style ={{marginTop:"20px" ,color:"#344767" }} onClick={handleClose} >
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />


            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
