import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VictoryPie, VictoryLegend,VictoryTooltip  } from 'victory';
import CustomLegend from './CustomLegend';

function SkillStatistics() {
  const [statistics, setStatistics] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/calculateSkillPercentages/${userId}`);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    }

    fetchStatistics();
  }, []);

  if (!statistics) {
    return <div>Loading...</div>;
  }

  const colorMap = {
    Beginner: '#97b1d5',
    Intermediate: '#414d5d',
    Advanced: '#7d0d33',
  };

  const data = [
    { x: 'Beginner', y: statistics.beginnerPercentage },
    { x: 'Intermediate', y: statistics.intermediatePercentage },
    { x: 'Advanced', y: statistics.advancedPercentage },
    
  ];

 

  return (
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '28.9vh',marginTop: '-31px', }}>
           <VictoryPie
           
        width={320} 
        height={300}
        data={data}

        colorScale={Object.values(colorMap)}
        labelRadius={({ innerRadius }) => innerRadius + 30}
        labels={({ datum }) => `${datum.x}: ${datum.y}%`}
        labelComponent={<VictoryTooltip style={{ fontSize: 20, fill: '#414d5d',  
        backgroundColor: 'blue', 
      }} />} 
      />
<CustomLegend colorMap={colorMap} /> 

    </div>
  );
}

export default SkillStatistics;
