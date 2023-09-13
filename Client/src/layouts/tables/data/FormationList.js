import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";
function FormationList({ onSelectFormation, initialSelectedFormationTitle,handleFormationSelect ,readOnly  }) {
  const [formations, setFormations] = useState([]);
  const [skills,setSkills]= useState([]);
  const id = localStorage.getItem('userId');

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/getuser/${id}`);
        const data = await response.json();
        setSkills(data.skills);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, [id]);
  const getFormations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/formation/getallform");
      const data = response.data;
      setFormations(data);
    } catch (error) {
      console.error("Error fetching formations:", error);
    }
  };

  useEffect(() => {
    getFormations();
  }, []);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0); 

  const [selectedFormationTitle, setSelectedFormationTitle] = useState(
    initialSelectedFormationTitle || ""
  );
  const handleFormationChange = (event) => {
    if (readOnly) {
      return;
    }
    const selectedTitle = event.target.value;
    setSelectedFormationTitle(selectedTitle);

    const selectedSkill = skills[selectedSkillIndex]; 
    const selectedId = formations.find(
      (formation) => formation.title === selectedTitle
    )?._id || "";

    onSelectFormation(selectedSkillIndex, selectedId, selectedTitle); 
  };


  return (

    <FormControl variant="outlined" fullWidth>
  <Select
    labelId="formation-select-label"
    id="formation-select"
    value={selectedFormationTitle}
    onChange={handleFormationChange}
    label="Select Formation"
  >
    <MenuItem value="" disabled>
      Recommend a Formation
    </MenuItem>
    {formations.map((formation) => (
      <MenuItem
        key={formation._id}
        value={formation.title}
        disabled={
          formation.authors.some(
            (author) => author._id.toString() === id.toString()
          ) || readOnly 
        }      >
          
        {formation.title}
      </MenuItem>
    ))}
  </Select>
 
</FormControl>


  );
}

FormationList.propTypes = {
  initialSelectedFormationTitle: PropTypes.string,
  onSelectFormation: PropTypes.func.isRequired,
  handleFormationSelect: PropTypes.func.isRequired, 
  readOnly: PropTypes.bool.isRequired, 

};

export default FormationList;
