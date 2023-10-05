import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import VerticalBarChart from 'examples/Charts/BarCharts/VerticalBarChart';
import MDBox from "components/MDBox";
import CircularProgress from "@mui/material/CircularProgress";

function CombinedChart() {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/formation/getallform') // Replace with your backend API endpoint
      .then(response => {
        setFormations(response.data);
      })
      .catch(error => {
        console.error('Error fetching formations:', error);
      });
  }, []);

  const formationWithMostAuthors = formations.reduce((maxFormation, formation) => {
    if (formation.authors.length > maxFormation.authors.length) {
      return formation;
    }
    return maxFormation;
  }, { authors: [] });

  // Convert formations data to fit VerticalBarChart structure
  const chartData = {
    labels: formations.map(formation => formation.title),
    datasets: [
      {
        label: 'Number of Authors',
        data: formations.map(formation => formation.authors.length),
        color: 'light', // Choose a color from the VerticalBarChart color options
      },
    ],
  };

  return (
    
    <VerticalBarChart
      title="Formation with Most Authors"
      description={`Formation: ${formationWithMostAuthors.title}\nNumber of Authors: ${formationWithMostAuthors.authors.length}`}
      chart={chartData}
      date={"3 hours ago"}
    />
  
  );
}

export default CombinedChart;
