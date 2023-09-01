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
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import FormationList from "./data/FormationList";
// Your Tables component
function Tables() {


const id = localStorage.getItem('userId');
const [formations, setFormations] = useState([]); 

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

  return (
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
