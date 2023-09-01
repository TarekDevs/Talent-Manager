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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/Dotnetquiz/components/Bill";

function BillingInformation() {
  return (
    <Card  style={{width:'890px' ,marginLeft:'670px',marginTop:"120px"}}    >
      <MDBox pt={3} px={2}    
>
        <MDTypography variant="h6" fontWeight="medium">
          Quiz .Net
                 </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} >
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Bill
            
          />
      
          
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
