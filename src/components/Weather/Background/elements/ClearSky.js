import React from 'react';
import { Sun, Moon, Stars } from '../styles';

const ClearSky = ({ isDay, sunPosition, moonPosition }) => {
  return (
    <>
      {isDay ? (
        <Sun 
          animate={{ left: `90%`, top: `50%` }}
          transition={{ duration: 1 }}
        />
      ) : (
        <Moon 
          animate={{ left: `90%`, top: `50%` }}
          transition={{ duration: 1 }}
        />
      )}
      <Stars visible={!isDay} />
    </>
  );
};

export default ClearSky; 