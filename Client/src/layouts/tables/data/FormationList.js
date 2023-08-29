import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

function FormationList({ onSelectFormation, initialSelectedFormationTitle }) {
  const [formations, setFormations] = useState([]);
  const id = localStorage.getItem('userId');

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

  const [selectedFormationTitle, setSelectedFormationTitle] = useState(
    initialSelectedFormationTitle || ""
  );

  const handleFormationChange = (event) => {
    const selectedTitle = event.target.value;
    setSelectedFormationTitle(selectedTitle);

    const selectedId = formations.find(
      (formation) => formation.title === selectedTitle
    )?._id || "";

    onSelectFormation(selectedId, selectedTitle);
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
        disabled={formation.authors.some(author => author._id.toString() === id.toString())} 
      >
          
        {formation.title}
      </MenuItem>
    ))}
  </Select>
</FormControl>


  );
}

FormationList.propTypes = {
  initialSelectedFormationTitle: PropTypes.string, // Define prop type
  onSelectFormation: PropTypes.func.isRequired,
};

export default FormationList;
