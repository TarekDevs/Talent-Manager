import React from 'react';
import PropTypes from 'prop-types';


function CustomLegend({ colorMap }) {
    return (
      <div style={{ fontSize: '15px' }}>
        {Object.keys(colorMap).map(skillLevel => (
          <div key={skillLevel} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: colorMap[skillLevel],
                marginRight: '5px',
              }}
            />
            {skillLevel}
          </div>
        ))}
      </div>
    );
  }

  CustomLegend.propTypes = {
  colorMap: PropTypes.object.isRequired, // Add prop validation
};
  export default CustomLegend;
