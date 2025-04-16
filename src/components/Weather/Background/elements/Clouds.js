import React from 'react';
import { CloudsContainer, Cloud, Sun, Moon, Stars } from '../styles';

const Clouds = ({ cloudComponents, isDay, sunPosition, moonPosition }) => {
  return (
    <>
      <CloudsContainer>
        {cloudComponents.map(cloudProps => (
          <Cloud 
            key={cloudProps.key}
            delay={cloudProps.delay}
            size={cloudProps.size} 
            dark={cloudProps.dark}
            style={cloudProps.style}
          />
        ))}
      </CloudsContainer>
      {isDay ? (
        <Sun 
          animate={{ left: `90%`, top: `50%` }}
          transition={{ duration: 1 }}
          style={{ opacity: 0.7 }}
        />
      ) : (
        <Moon 
          animate={{ left: `90%`, top: `50%` }}
          transition={{ duration: 1 }}
          style={{ opacity: 0.7 }}
        />
      )}
      <Stars visible={!isDay} opacity={0.5} />
    </>
  );
};

export default Clouds;