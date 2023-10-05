import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import HorizontalBarChart from 'examples/Charts/BarCharts/HorizontalBarChart';

function BestRatedFormation() {
  const [bestRatedFormation, setBestRatedFormation] = useState(null);

  useEffect(() => {
    async function fetchData() {
        try {
          const response = await axios.get('http://localhost:8000/api/formation/getallform'); // Fetch all formations
          const formations = response.data;
      
          // Find the formation with the highest average rating
          let highestRatingFormation = null;
          formations.forEach((formation) => {
            if (!highestRatingFormation || formation.averageRating > highestRatingFormation.averageRating) {
              highestRatingFormation = formation;
            }
          });
      
          setBestRatedFormation(highestRatingFormation);
        } catch (error) {
          console.error('Error fetching formations:', error);
        }
      }
      
      fetchData();
      

    fetchData();
  }, []);

  const bestRatedFormationChart = {
    labels: [bestRatedFormation ? bestRatedFormation.title : 'No Formation'],
    datasets: [
      {
        label: 'Average Rating',
        data: [bestRatedFormation ? bestRatedFormation.averageRating.toFixed(1) : 0],
        color: 'primary', 
      },
    ],
  };
  

  return (
    <div>
     
      {bestRatedFormation ? (
        <div>
          
          <HorizontalBarChart
  
  chart={bestRatedFormationChart}
  title="Formation With Most Ratings"
  description="Formation with the highest average rating"

/>

        </div>
      ) : (
        <p>Loading formation with most ratings...</p>
      )}
    </div>
  );
}

export default BestRatedFormation;
