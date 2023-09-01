import React from "react";
import PropTypes from "prop-types"; 

import {
  Modal,
  Fade,
  TextField,
  Button,
} from "@mui/material";
import MDButton from "components/MDButton";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDAvatar from "components/MDAvatar";

function ProfileModal({
  open,
  handleClose,
  firstName,
  lastName,
  email,
  phone,
  profileInformation,
  setProfileInformation,
  diplome,
  setDiplome,
  handleSave,
  profilePicture,
}) {
  return (
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
            <MDAvatar src={profilePicture} alt="profile-image" size="l" shadow="sm" style={{marginBottom:"15px"}} />
          <MDTypography variant="h6" fontWeight="medium">
          Full Name: {firstName} {lastName} 
          
          </MDTypography> 
          <MDTypography variant="h6" fontWeight="medium">
          Email: {email} 
          </MDTypography>           
          <MDTypography variant="h6" fontWeight="medium">
         Phone : {phone} 
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
          Profile Information :
                    <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={profileInformation}
            onChange={(e) => setProfileInformation(e.target.value)}
          /> </MDTypography>   
           <MDTypography variant="h6" fontWeight="medium">
          Diplome:
                    <TextField
            variant="outlined"
            fullWidth
            value={diplome}
            onChange={(e) => setDiplome(e.target.value)}
          /></MDTypography>    
          <MDButton
                 variant="outlined"
                 size="small"
                 color="info"
                 type="external"    
                 style ={{marginLeft:'380px',marginRight:"20px", marginTop:"20px"}}onClick={handleSave} >
            Save
          </MDButton>
           <MDButton
                 variant="outlined"
                 size="small"
                 color="info"
                 type="external"   
                 style ={{marginTop:"20px"  }} onClick={handleClose} >
            Cancel
          </MDButton>
        </div>
      </div>
    </Fade>
  </Modal>
  );
}



ProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    profileInformation: PropTypes.string.isRequired,
    setProfileInformation: PropTypes.func.isRequired,
    diplome: PropTypes.string.isRequired,
    setDiplome: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    profilePicture:PropTypes.string.isRequired,

  };

export default ProfileModal;
