// Import necessary components and modules
import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import PropTypes from "prop-types";
import axios from "axios";
import { Notfound } from "layouts/Notfound/Notfound";
import { useNavigate, useParams } from "react-router-dom";

// Your Tables component
function Tables() {


const { id } = useParams(); // Extract the "id" parameter from route params
const [formations, setFormations] = useState([]); 
const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));







useEffect(() => {
  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/getuser/${id}`);
      const data = await response.json();
      // setRoles(data.Roles);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    if (!user) {
      navigate("/authentication/sign-in", { replace: true });
    }
  };

  getUser();
}, [id,navigate]);


useEffect(() => {
  async function fetchFormations() {
    try {
      const response = await axios.get("http://localhost:8000/api/formation/getallform");
      const data = response.data;
      setFormations(data);
    } catch (error) {
      console.error("Error fetching formations:", error);
    }
  }

  fetchFormations();
}, []);

const {columns,rows}=authorsTableData()

return  (
  <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  User Skills Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              <DataTable
      table={{
        columns: columns.map((column) => ({
          Header: column.name,
          accessor: column.selector,
          sortable: column.sortable,
        })),
        rows: rows.map((row, index) => ({
          ...row,
          })),
        }}
      />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
 
);
}

export default Tables;
