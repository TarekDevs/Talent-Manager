/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState,useEffect } from "react";
import axios from "axios";

export default function data() {


  const [formations, setFormations] = useState([]);
  const id = localStorage.getItem('userId');

  const avatars = (members) =>
  members.map(([image, name]) => (
    <Tooltip key={name} title={name} placeholder="bottom">
      <MDAvatar
        src={image}
        alt={name}
        size="xs"
        sx={{
          border: ({ borders: { borderWidth }, palette: { white } }) =>
            `${borderWidth[2]} solid ${white.main}`,
          cursor: "pointer",
          position: "relative",

          "&:not(:first-of-type)": {
            ml: -1.25,
          },

          "&:hover, &:focus": {
            zIndex: "10",
          },
        }}
      />
    </Tooltip>
  ));


  const getFormations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/formation/getallform');
      const data = response.data;
      setFormations(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching formations:", error);
    }
  };
 
  useEffect(() => {
    getFormations();

  }, []);

  
    const Members = ({ authors }) => (
      <MDBox display="flex" py={1}>
        {avatars(authors.map((author) => [author.profilePicture, author.firstName +  author.lastName]))}
      </MDBox>
    );
  
    return {
      columns: [
        { Header: "formations", accessor: "formations", width: "45%", align: "left" },
        { Header: "Members", accessor: "authors", width: "45%", align: "left" },
      ],
  
      rows: formations.map((formation) => ({
        formations: (
          <MDBox display="flex" alignItems="center" lineHeight={1} key={formation.id}>
            <MDAvatar src={formation.image} name={formation.title} size="sm" />
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
              {formation.title}
            </MDTypography>
          </MDBox>
        ),
        authors: (
          <Members authors={formation.authors} />
        ),
      })),
    };
  }
  