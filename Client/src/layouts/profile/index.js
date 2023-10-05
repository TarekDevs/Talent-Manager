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
import MDButton from "components/MDButton";
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

// Data
import profilesListData from "layouts/profile/data/profilesListData";
import ProfileModal from "./components/ProfileModal"


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
import CloudDownloadIcon  from '@mui/icons-material/CloudDownload'; 
import {
  TextField,
  Button,
} from "@mui/material";
import axios from "axios"; 
import { Badge, CheckBox, GitHub, LinkedIn  } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Overview() {

  const id = localStorage.getItem('userId');
  const [user,setUser]= useState(null);  
  const [open, setOpen] = useState(false); 
  const [profileInformation, setProfileInformation] = useState("");
  const [diplome, setDiplome] = useState("");
  const [linkedinlink,setlinkedinlink]= useState("")
  const [githublink,setgithublink]=useState("")
  const navigate = useNavigate();

//modal
  const handleOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

 




//handleupdateuser 
const handleSave = () => {
  const updatedProfile = {
    firstName,
    lastName,
    phone,
    email,
    ProfileInformation: profileInformation,
    diplome: diplome,
    linkedinlink:linkedinlink,
    githublink:githublink,
  };

  axios
    .put(`http://localhost:8000/api/users/UpdateUser/${id}`, updatedProfile)
    .then((response) => {
      console.log(response);

      setUser((prevUser) => ({
        ...prevUser,
        ProfileInformation: profileInformation,
        diplome : diplome,
        linkedinlink:linkedinlink,
        githublink:githublink,
      }));

      handleClose();
    })
    .catch((error) => {
      console.error(error);
    });
};

const downloadFormation = (link,index) => {
  const downloadLink = `http://localhost:8000/api/formation/course/${encodeURIComponent(link)}`;

  // Create a hidden anchor element to trigger the download
  const anchor = document.createElement("a");
  anchor.href = downloadLink;
  anchor.download = link; // You can set a custom download filename here
  anchor.style.display = "none";
  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);
};


const [formations, setFormations] = useState([]);
const [roles, setRoles] = useState([]);





//getuserinformation
const getUser = async() => {
  const response = await fetch (`http://localhost:8000/api/users/getuser/${id}`, {
    method: "GET",
  });

  const data = await response.json();
  setUser(data);
  setProfileInformation(data.Information);
  setDiplome(data.diplome);
  setFormations(data.formations)
  setlinkedinlink(data.linkedinlink)
  setgithublink(data.githublink)
  setRoles(data.Roles);

 

};


useEffect(() => {
  formations.forEach(async formation => {
    const isDisabled = await checkButtonStatus(formations.id);
    formation.disabled = isDisabled;
  });
  setFormations([...formations]);
}, []);

const checkButtonStatus = async (formationId) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/users/checkButtonStatus/${formationId}`);
    return response.data.disabled;
  } catch (error) {
    console.error('Error checking button status:', error);
    return false;
  }
};

const userr = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  
    if (userr) {
      navigate("/dashboard/profile", { replace: true });
    } else if (!userr) {
      navigate("/authentication/sign-in", { replace: true });
    } 

  getUser();
}, [id,navigate]);


  if (!user) return null;

  const {
    
    firstName,
    lastName,
    email,
    phone,
    
    skills,
    profilePicture
  } = user;



  const hasEmployeeRole = roles.some(role => role.name === "employee");



  function handleDetails (Id) {
    // Navigate to the user details page for the specified user ID
    window.location.href = `/dashboard/skills/${Id}`;
  }

  

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
                  fullName: firstName,
                  lastName: lastName,
                  mobile: phone,
                  email: email,
                  diplome: user.diplome,
                  skills: (
                    <div>
                      <ul>
                      {user.skills.map((skill, index) => (
                          <p key={index}>{skill.name}</p>
    
                        ))}
                      </ul>
                      <Link onClick={() => handleDetails(user._id)} style={{ color: "blue" }}>
                     see more
                    </Link>
                    </div>

                  ),

                  // careerPlan:
                  //  user.careerPlan || null
                  
                }}
                           
                social={[
               
                  {
                    link: `${linkedinlink}`,
                    icon: <LinkedIn />,
                    color: "linkedin",
                  },
                  {
                    link: `${githublink}`,
                    icon: <GitHub />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                handleOpen={handleOpen}

                shadow={false}
                
              />
              

          
            </Grid>
          

          </Grid>


          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            careerPlan:
            </MDTypography>
            <MDTypography variant="button" color="text"  fontWeight="medium" style={{with:"50px"}}>

            {user.careerPlan} 
              </MDTypography>

          <ProfileModal
          profilePicture={profilePicture}
        open={open}
        handleClose={handleClose}
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        profileInformation={profileInformation}
        setProfileInformation={setProfileInformation}
        diplome={diplome}
        linkedinlink={linkedinlink}
        setlinkedinlink={setlinkedinlink}
        setgithublink={setgithublink}
        githublink={githublink}
        setDiplome={setDiplome}
        handleSave={handleSave}
      />
      
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            My trainings
          </MDTypography>
  
        </MDBox>
        <MDBox p={2}>
            <Grid container spacing={6}>

            {/* <MDTypography variant="h6" fontWeight="medium">
  {user.skills.map(skill => (
    <div key={skill.name}>
      <span>{skill.name}</span>
      <span>{skill.status}</span>
    </div>
  ))}
</MDTypography> */}

            {formations.map((formation,index) => {
             
              return (
                <Grid item xs={12} md={6} xl={3} key={formation.formation?._id}>
                  <DefaultProjectCard
                    image={formation.formation?.image}
                    label={formation.formation?.label}
                    title={formation.formation?.title}
                    desc={formation.formation?.desc}
                    badge={formation?.valid}
                    action={{
                      type: 'internal',
                      route: "",
                      color: 'info',
                      label: ' continue Course',
                    }} />
                
                  <MDButton
                 variant="outlined"
                 size="small"
                 color="info"
                 type="external"
      onClick={() => {
        const formationLink = formations[index].formation?.link;
        downloadFormation(formationLink, index);

      }}
               >
                 Start Course
               </MDButton>

               <Link to={`/quiz/${formation.formation?._id}`}>
              
    <MDButton
      variant="outlined"
      size="small"
      color="info"
      type="external"
     style={{marginLeft:"5px"}}
    
    >validate your course
    </MDButton>
  </Link>
               
  


                </Grid>
              );
            })}

          </Grid>
        
        </MDBox>
        
      </Header>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
