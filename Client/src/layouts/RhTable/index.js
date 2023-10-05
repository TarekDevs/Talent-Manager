import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axios from "axios";
import DataTable from "examples/Tables/DataTable"; 
import MDButton from "components/MDButton";
import { Notfound } from "layouts/Notfound/Notfound";
import { useNavigate } from "react-router-dom";

function Tables() {

  const id = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const LoadingSpinner = () => {
    return (
      <div className="loading-spinner">
      </div>
    );
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/byrole");
        setUsers(response.data);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      if (user) {
        navigate("/dashboard/rhTable", { replace: true });
      } else if (!user) {
        navigate("/authentication/sign-in", { replace: true });
      }
    };

    getUser();
  }, [navigate]);

  


  // pour extraire le role

  const getUserr = async() => {
    const response = await fetch (`http://localhost:8000/api/users/getuser/${id}`, {
      method: "GET",
    });
  
    const data = await response.json();
    setRoles(data.Roles);
  
   
  
  };
  useEffect(() => {
    getUserr();
}, [id]);

  const hasEmployeeRole = roles.some(role => role.name === "HR");


  useEffect(() => {
    const columns = [
      { name: "First name", selector: "firstName", sortable: true },
      { name: "Last name", selector: "lastName", sortable: true },
      { name: "Email", selector: "email", sortable: true },
     
      {
        name: "Actions",
        selector: "datailAction",
        sortable: true,
      },
     
    ];


 const mappedData = users.map((user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  
  datailAction: (
    <MDTypography>
     
        <MDButton color="dark"  onClick={() => handleDetails(user._id)}>
          details
        </MDButton>
 
   
    </MDTypography>
  ),
  }));

setColumns(columns);
setData(mappedData);
}, [users]);



 
  function handleDetails (Id) {
    // Navigate to the user details page for the specified user ID
    window.location.href = `/dashboard/userDetails/${Id}`;
  }


  if (!hasEmployeeRole) {
    return <LoadingSpinner />;
  }



  
return hasEmployeeRole ? (
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
                  User Management
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
                    rows: data.map((row, index) => ({
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
  ) : (
    <Notfound />
  );
}


export default Tables;
