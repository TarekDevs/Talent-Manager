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
import { Link, Navigate } from "react-router-dom";
// Overview page components
import Header from "layouts/userDetails/components/Header";
import { useParams } from 'react-router-dom';
// Data
import Card from "@mui/material/Card";
import Bill from "layouts/billing/components/CarrierePlan";
import { useState,useEffect } from "react";
import { Notfound } from "layouts/Notfound/Notfound";
import axios from "axios"; 
import {GitHub, LinkedIn  } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Overview() {

  const { id } = useParams();
  const [user,setUser]= useState(null);  
  const [profileInformation, setProfileInformation] = useState("");
  const [diplome, setDiplome] = useState("");
  const [careerPlans, setCareerPlans] = useState([]);
  const [formations, setFormations] = useState([]);

  const userr = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();


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
        diplome : diplome,
      }));

      handleClose();
    })
    .catch((error) => {
      console.error(error);
    });
};







//getuserinformation
const [roles, setRoles] = useState([]);

const getUser = async() => {
  const response = await fetch (`http://localhost:8000/api/users/getuser/${id}`, {
    method: "GET",
  });

  const data = await response.json();
  setUser(data);
  setProfileInformation(data.ProfileInformation);
  setDiplome(data.diplome);
  setFormations(data.formations)
  setRoles(data.Roles);


};
console.log(user);

useEffect(() => {
  // Fetch career plans based on user's skills
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/careerPlanRecommendation", {
        companyGoals: ["html"],
        userSkills: user.skills.map((skill) => skill.name), 
      });

      setCareerPlans(response.data);
      console.log(careerPlans);
    } catch (error) {
      console.error("Error fetching career plans: ", error);
    }
  };

  fetchData(); 
}, [user]); 


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

useEffect(() => {
 if (!userr) {
    navigate("/authentication/sign-in", { replace: true }); 
  }


  getUser();

}, [id,Navigate]);


  if (!user) return null;

  const {
    
    firstName,
    lastName,
    email,
    phone,

  } = user;





  const hasEmployeeRole = roles.some(role => role.name === "employee");

  

  return  (
    <DashboardLayout>
      <DashboardNavbar />


      <Header>







      <MDBox mb={2} />
        <MDBox mt={5} mb={3}>
          
          <Grid container spacing={1}>
      
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />

        

              <ProfileInfoCard
                title="profile information"
                description= ""
                user={user}

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
                      
                      <Link to={`/dashboard/skills/${user._id}`} style={{ color: "blue" }}>
                       see more
                      </Link>
                    </div>
                  ),
                }}
                           
                social={[
               
                  {
                    link: "https://linkedin.com/",
                    icon: <LinkedIn />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <GitHub />,
                    color: "instagram",
                  },
                ]}
              
                action={{ route: "", tooltip: "Edit Profile" }}

                shadow={false}
                
              />             
            </Grid>
          </Grid>
       
        </MDBox>
       
       
        
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            My trainings
          </MDTypography>
  
        </MDBox>
        <MDBox p={2}>
            <Grid container spacing={6}>

            {formations.map((formation,index) => {
             
              return (
                <Grid item xs={12} md={6} xl={3} key={formation.formation._id}>
                  <DefaultProjectCard
                    image={formation.formation.image}
                    label={formation.formation.label}
                    title={formation.formation.title}
                    desc={formation.formation.desc}
                    badge={formation.valid}
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
        const formationLink = formations[index].formation.link;
        downloadFormation(formationLink, index);

      }}
               >
                 Start Course
               </MDButton>

               <Link to={`/quiz/${formation.formation._id}`}>
              
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
         <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
         Career Plan Recomandations
        </MDTypography>
      </MDBox>
   
      <MDBox pt={1} pb={2} px={2}>
         <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        
         {careerPlans.map((plan, index) => (
   <Bill
   key={index}
   careerPlan={plan.title}
  userId={id}
  
  
  />
))}
          
        
          
        </MDBox>
      </MDBox>
    </Card>
    </Header>
      <Footer />
    </DashboardLayout>
  )
}

export default Overview;
