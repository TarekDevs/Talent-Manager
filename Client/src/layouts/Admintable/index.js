import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DataTable from "examples/Tables/DataTable"; // Import your DataTable component here
import MDButton from "components/MDButton";

function Tables() {
  const id = localStorage.getItem("userId");
  const [user, setUser] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [banDate, setBanDate] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/getuser/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [id]);

  const formattedBanDate = new Date(banDate).toISOString();

  
const handleBan = async (userID) => {
  await axios.put("http://localhost:8000/api/users/banuser", { userID, banDate: formattedBanDate });
  setUser((prevUser) => ({
    ...prevUser,
    isBanned: new Date(banDate)
  }));
};

const handleUnban = async (userID) => {
  await axios.put("http://localhost:8000/api/users/unbanuser", { userID });
  setUser((prevUser) => ({
    ...prevUser,
    isBanned: null
  }));
};

  useEffect(() => {
    const columns = [
      { name: "First name", selector: "firstName", sortable: true },
      { name: "Last name", selector: "lastName", sortable: true },
      { name: "Email", selector: "email", sortable: true },
      {
        name: "Ban Status",
        selector: "isBannedStatus",
        sortable: true,
      },
      {
        name: "Actions",
        selector: "banActions",
        sortable: true,
      },
     
    ];

 // ...

const data = [
  {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
   
    isBannedStatus: (
      <p>
        {new Date(user.isBanned) > new Date() ? "Banned" : "Active"}</p>
    ),
    banActions: (
      <MDTypography>
        {new Date(user.isBanned) > new Date() ? (
          <MDButton color="dark" onClick={() => handleUnban(user._id)}>
            Unban
          </MDButton>
        ) : (
          <>
            <div key={user._id}>
              <input
              style={{ padding: '8px 12px',
                border: '1px solid #ccc',
                borderradius: '4px',
                fontsize: '14px',
                fontFamily:'monospace',
                outline: 'none',
                bordercolor: '#007bff'

                
              }}
                type="date"
                id={id}
                value={
                  new Date(user.isBanned) > new Date()
      ? user.isBanned.toISOString().substr(0, 10) 
      : null
  }
                
                onChange={(e) => setBanDate(e.target.value)}
              /> <MDButton color="primary" onClick={() => handleBan(user._id)} style={{marginleft:'25px'}}>
              Ban
            </MDButton>
            </div>
           
          </>
        )}
      </MDTypography>
    ),
  },
];

// ...

    setColumns(columns);
    setData(data);
  }, [user]);

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
  );
}

export default Tables;
