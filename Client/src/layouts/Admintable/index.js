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
import { useNavigate } from "react-router-dom";
import { Notfound } from "layouts/Notfound/Notfound";

function Tables() {
  const id = localStorage.getItem("userId");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [banDate, setBanDate] = useState(null);
  const [users, setUsers] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/getallusers');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      if (user) {
        navigate("/dashboard/admintable", { replace: true });
      } else if (!user) {
        navigate("/authentication/sign-in", { replace: true });
      }
    };

    getUser();
  }, [navigate]);

  const formattedBanDate = new Date(banDate).toISOString();

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

const hasEmployeeRole = roles.some(role => role.name === "admin");

const handleBan = async (userID) => {
  await axios.put("http://localhost:8000/api/users/banuser", { userID, banDate: formattedBanDate });
  const updatedUsers = users.map((user) => {

    if (user._id === userID) {
      user.isBanned = new Date(banDate);
    }
    return user;
  });
  setUsers(updatedUsers);
};
 
const handleUnban = async (userID) => {
  await axios.put("http://localhost:8000/api/users/unbanuser", { userID });
  const updatedUsers = users.map((user) => {
    if (user._id === userID) {
      return { ...user, isBanned: null };
    }
    return user;
  });
  setUsers(updatedUsers);
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


 const mappedData = users.map((user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isBannedStatus: (
    <p>{new Date(user.isBanned) > new Date() ? "Banned" : "Active"}</p>
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
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                borderColor: '#007bff',
              }}
              type="date"
              id={user._id}
              value={
                new Date(user.isBanned) > new Date()
                  ? user.isBanned.toISOString().substr(0, 10)
                  : null
              }
              onChange={(e) => setBanDate(e.target.value)}
            />
            <MDButton
              color="primary"
              onClick={() => handleBan(user._id)}
              style={{ marginLeft: '25px' }}
            >
              Ban
            </MDButton>
          </div>
        </>
      )}
    </MDTypography>
  ),
}));

setColumns(columns);
setData(mappedData);
}, [users]);




if (!hasEmployeeRole) {
  return <div className="loading-spinner">
  </div>;
}

  return  hasEmployeeRole ?(
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
