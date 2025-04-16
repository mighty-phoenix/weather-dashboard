import React from 'react';
import { CloudsContainer, Cloud, Sun, Moon, Stars } from '../styles';

const Clouds = ({ cloudComponents, isDay, sunPosition, moonPosition, weatherCode }) => {
  // Determine how many clouds to show based on weather code
  let cloudCount = cloudComponents.length;
  let cloudOpacity = 1.0;
  
  // Partly cloudy (1003) - fewer clouds
  if (weatherCode === 1003) {
    cloudCount = Math.min(4, cloudComponents.length);
    cloudOpacity = 0.8;
  }
  // Cloudy (1006) - medium cloud coverage
  else if (weatherCode === 1006) {
    cloudCount = Math.min(6, cloudComponents.length);
    cloudOpacity = 0.9;
  }
  // Overcast (1009) - full cloud coverage
  else if (weatherCode === 1009) {
    cloudCount = cloudComponents.length;
    cloudOpacity = 1.0;
  }
  
  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, cloudCount).map((cloudProps, index) => (
          <Cloud
            key={`cloud-c-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            speed={cloudProps.speed || 1}
            dark={cloudProps.dark}
            style={{
              ...cloudProps.style,
              opacity: cloudProps.opacity || cloudOpacity
            }}
          />
        ))}
      </CloudsContainer>
      
      {/* Render sun/moon only for partly cloudy */}
      {weatherCode === 1003 && isDay && (
        <Sun
          animate={{ left: '90%', top: '50%' }}
          transition={{ duration: 1 }}
          style={{ opacity: 0.8, zIndex: 0 }}
        />
      )}
      
      {weatherCode === 1003 && !isDay && (
        <Moon
          animate={{ left: '90%', top: '50%' }}
          transition={{ duration: 1 }}
          style={{ opacity: 0.8, zIndex: 0 }}
        />
      )}
      <Stars visible={!isDay} opacity={0.5} />
    </>
  );
};

export default Clouds;