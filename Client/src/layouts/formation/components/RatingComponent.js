import React from 'react';
import PropTypes from 'prop-types';
import { Rating } from '@mui/material';

const RatingComponent = ({ formationId, averageRating, onRate }) => {
  return (
    <div>
      {/* <p>Average Rating: {averageRating.toFixed(1)}</p> */}
      <Rating
        name={`rating-${formationId}`}
        value={averageRating}
        precision={0.5} 
        onChange={(event, newValue) => onRate(newValue)}
      />
    </div>
  );
};

RatingComponent.propTypes = {
  formationId: PropTypes.string.isRequired,
  averageRating: PropTypes.number.isRequired,
  onRate: PropTypes.func.isRequired,
};

export default RatingComponent;
