/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"; // Add necessary imports
// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState,useEffect } from "react";
import axios from "axios";
import FormationList from "./FormationList";

export default function data() {


  const id = localStorage.getItem('userId');
  const [user, setUser] = useState({});
  const [skills, setSkills] = useState([]);
  const [row, setRows] = useState([]); // Define the state variable

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/getuser/${id}`);
        const data = await response.json();
        setUser(data);
        setSkills(data.skills);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, [id]);
  const handleFormationSelect = async (formationId, rowIndex, formationTitle) => {
    try {
      await axios.put(`http://localhost:8000/api/formation/addFormationTitle/${id}`, {
        skillIndex: rowIndex,
        formationTitle: formationTitle,
      });
  
      await axios.put(`http://localhost:8000/api/formation/postformation/${id}`, {
        formationIds: [formationId],
      });
  
      const updatedRows = [...data];
      updatedRows[rowIndex].formationId = formationId;
  
      setRows(updatedRows);
    } catch (error) {
      console.error("Error adding formation:", error);
    }
  };
  
   
  

  const Skill = ({ name, status, skillId,  }) => {
    const [selectedStatus, setSelectedStatus] = useState(status);
  
    const updateStatus = async (newStatus) => {
      try {
        await axios.put(`http://localhost:8000/api/users/updateStatus/${id}/${skillId}`, {
          newStatus: newStatus,
        });
  
        setSelectedStatus(newStatus);
      } catch (error) {
        console.error("Error updating skill status:", error);
      }
    };




  
    return (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDBox ml={2}>
          <FormControl>
            <Select
              value={selectedStatus}
              onChange={(event) => {
                const newStatus = event.target.value;
                updateStatus(newStatus); 
              }}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl></MDBox>
    

        </MDBox>
    );
  };
  
  const columns = [
    { name: 'Skill Name', selector: 'name', sortable: true },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: (row) => row.status, 
    },
     {
      name: 'formation',
      selector: 'formation',
      sortable: true,
    },
  ];
  const data = skills.map((skill, index) => ({
    id: index,
    name: skill.name,
    status: (
      <Skill
        key={index}
        
        status={skill.status}
        skillId={skill._id}
       
      />
    ),
    formation: (
      
<FormationList
  initialSelectedFormationTitle={user.skills.formationTitle}
  onSelectFormation={(formationId, formationTitle) =>
    handleFormationSelect(formationId, index, formationTitle)
  }
/>

    ),
  }));
  

 
 
    return {
      columns,rows:data}
    
  
  };

 