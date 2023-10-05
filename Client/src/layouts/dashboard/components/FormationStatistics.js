import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import CircularProgress from "@mui/material/CircularProgress";

function FormationStatistics() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/users/getCountValidFormationsByMonth');
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }

    fetchData();
  }, []);

  const months = [
    'Jan', 'Feb', 'Mar', 'Ap', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  if (!chartData) {
    return <CircularProgress  style={{marginLeft:"220px",marginTop:'75px'}}/>; // Display the loading icon
  }

 
  
  const chartDataWithMissingMonths = months.map((month, index) => {
    const entry = chartData.find(data => data._id === index + 1);
    return {
      _id: index + 1,
      count: entry ? entry.count : 0
    };
  });

  const chartLabels = chartDataWithMissingMonths.map(entry => months[entry._id - 1]);
  const chartValues = chartDataWithMissingMonths.map(entry => entry.count);

  
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Valid Formations',
        data: chartValues,
        fill: true,
        borderColor: 'rgba(255, 255, 255, .2)',
        backgroundColor: 'rgba(255, 255, 255, .2)',

      },
    ],
  };
  
  const options = {
    
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [15, 5],
            color: "rgba(255, 255, 255, .2)",
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 2,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
            },
            color: "#fff",
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [10, 15],
            color: "rgba(255, 255, 255, .2)",
           
          },
          ticks: {
            display: true,
            color: "white",
            padding: 8,
            font: {
              size: 12,
              weight: 310,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
  }
  
  
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
  }

export default FormationStatistics
