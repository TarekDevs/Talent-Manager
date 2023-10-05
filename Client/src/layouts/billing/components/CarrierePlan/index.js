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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function Bill({ careerPlan,userId, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;


  const handleCareerPlanUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/users/career-plan/${userId}`, {
        careerPlan: careerPlan,
      });

      if (response.status === 200) {
        // The career plan was updated successfully
        alert('Career plan updated successfully');
        // You can perform any additional actions here, such as updating the UI.
      }
    } catch (error) {
      console.error(error);
      // Handle errors appropriately, e.g., show an error message to the user.
    }
  };

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "grey-100"}
      borderRadius="lg"
      p={3}
      mb={noGutter ? 0 : 1}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {careerPlan}
          </MDTypography>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="outlined"
                 size="small"
                 color="info"
                 type="external" onClick={handleCareerPlanUpdate}>
               &nbsp;Accept
              </MDButton>
            </MDBox>
        
          </MDBox>
        </MDBox>
       {/*  <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
           Required Skills:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
             skills
            </MDTypography>
          </MDTypography>
        </MDBox>
        */}
      
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  careerPlan: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;