import React, { useMemo } from 'react';
import { 
  CloudsContainer,
  Cloud,
  SnowContainer,
  SnowCloudGroup,
  Snow as SnowWrapper,
  Snowflake
} from '../styles';

const Snow = ({ cloudComponents, weatherCode, isMobile }) => {
  // Determine snow characteristics based on weather code
  const snowConfig = useMemo(() => {
    // Light snow or patchy snow (1066, 1210-1213, 1255)
    if (weatherCode === 1066 || 
        (weatherCode >= 1210 && weatherCode <= 1213) || 
        weatherCode === 1255) {
      return {
        snowCloudCount: isMobile ? 2 : 3,
        snowflakesPerCloud: isMobile ? 2 : 4,
        snowflakeCount: isMobile ? 15 : 30,
        speed: 0.8,
        size: [0.6, 1.0],
        opacity: 0.8,
        swaying: 15 // swing degrees
      };
    }
    // Moderate snow (1216-1219, 1258)
    else if ((weatherCode >= 1216 && weatherCode <= 1219) || 
             weatherCode === 1258) {
      return {
        snowCloudCount: isMobile ? 3 : 4,
        snowflakesPerCloud: isMobile ? 3 : 6,
        snowflakeCount: isMobile ? 20 : 40,
        speed: 1.0,
        size: [0.8, 1.2],
        opacity: 0.9,
        swaying: 20
      };
    }
    // Heavy snow or blizzard (1114, 1117, 1222-1225)
    else if (weatherCode === 1114 || 
             weatherCode === 1117 || 
             (weatherCode >= 1222 && weatherCode <= 1225)) {
      return {
        snowCloudCount: isMobile ? 4 : 6,
        snowflakesPerCloud: isMobile ? 4 : 8,
        snowflakeCount: isMobile ? 30 : 60,
        speed: 1.3,
        size: [0.8, 1.4],
        opacity: 1.0,
        swaying: 25
      };
    }
    // Sleet (1069, 1204-1207, 1249-1252)
    else if (weatherCode === 1069 || 
             (weatherCode >= 1204 && weatherCode <= 1207) || 
             (weatherCode >= 1249 && weatherCode <= 1252)) {
      return {
        snowCloudCount: isMobile ? 3 : 4,
        snowflakesPerCloud: isMobile ? 3 : 5,
        snowflakeCount: isMobile ? 20 : 35,
        speed: 1.2,
        size: [0.6, 0.9], // smaller for sleet
        opacity: 0.85,
        swaying: 10 // less swaying for sleet (more direct fall)
      };
    }
    // Ice pellets (1237, 1261-1264)
    else if (weatherCode === 1237 || 
             (weatherCode >= 1261 && weatherCode <= 1264)) {
      return {
        snowCloudCount: isMobile ? 3 : 4,
        snowflakesPerCloud: isMobile ? 3 : 5,
        snowflakeCount: isMobile ? 18 : 35,
        speed: 1.4, // faster for ice pellets
        size: [0.5, 0.8], // smaller for ice pellets
        opacity: 0.9,
        swaying: 8 // even less swaying
      };
    }
    // Default snow configuration
    return {
      snowCloudCount: isMobile ? 3 : 4,
      snowflakesPerCloud: isMobile ? 3 : 6,
      snowflakeCount: isMobile ? 20 : 40,
      speed: 1.0,
      size: [0.8, 1.2],
      opacity: 0.9,
      swaying: 20
    };
  }, [weatherCode, isMobile]);
  
  // Generate snowflakes
  const snowflakes = useMemo(() => {
    const seed = weatherCode * 100;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    const isBlizzard = weatherCode === 1117;
    const isHeavy = weatherCode >= 1222 && weatherCode <= 1225;
    
    // Add special animation class for different snow types
    let snowClass = '';
    if (isBlizzard) {
      snowClass = 'blizzard';
    } else if (isHeavy) {
      snowClass = 'heavy';
    } else if (weatherCode === 1237 || (weatherCode >= 1261 && weatherCode <= 1264)) {
      snowClass = 'ice-pellets';
    } else if (weatherCode === 1069 || 
              (weatherCode >= 1204 && weatherCode <= 1207) || 
              (weatherCode >= 1249 && weatherCode <= 1252)) {
      snowClass = 'sleet';
    }
    
    return [...Array(snowConfig.snowflakeCount)].map((_, i) => {
      const size = snowConfig.size[0] + seedRandom(i) * (snowConfig.size[1] - snowConfig.size[0]);
      const speed = snowConfig.speed * (0.8 + seedRandom(i + 50) * 0.4);
      const sway = snowConfig.swaying * (0.7 + seedRandom(i + 100) * 0.6);
      
      return (
        <Snowflake 
          key={`snow-${i}-${weatherCode}`} 
          delay={i * 0.1} 
          size={size}
          sway={sway}
          className={snowClass}
          style={{ 
            left: `${(i * 2.5) % 100}%`,
            opacity: snowConfig.opacity * (0.8 + seedRandom(i + 200) * 0.4),
            animationDuration: `${15 / speed}s`,
          }}
        />
      );
    });
  }, [weatherCode, snowConfig]);
  
  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, snowConfig.snowCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`snow-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={cloudProps.dark}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.9)',
              zIndex: 3
            }}
          />
        ))}
      </CloudsContainer>
      <SnowContainer>
        {cloudComponents.slice(0, snowConfig.snowCloudCount).map((cloudProps, index) => (
          <SnowCloudGroup 
            key={`snow-group-${index}-${weatherCode}`} 
            style={{ 
              left: cloudProps.style.left,
              top: `calc(${cloudProps.style.top} + 5%)`,
              width: `${200 * cloudProps.size}px`
            }}
          >
            {[...Array(snowConfig.snowflakesPerCloud)].map((_, i) => {
              const isBlizzard = weatherCode === 1117;
              const isHeavy = weatherCode >= 1222 && weatherCode <= 1225;
              
              // Add special animation class for different snow types
              let snowClass = '';
              if (isBlizzard) {
                snowClass = 'blizzard';
              } else if (isHeavy) {
                snowClass = 'heavy';
              } else if (weatherCode === 1237 || (weatherCode >= 1261 && weatherCode <= 1264)) {
                snowClass = 'ice-pellets';
              } else if (weatherCode === 1069 || 
                        (weatherCode >= 1204 && weatherCode <= 1207) || 
                        (weatherCode >= 1249 && weatherCode <= 1252)) {
                snowClass = 'sleet';
              }
              
              const size = snowConfig.size[0] + ((i + index) % 5) / 10;
              const speed = snowConfig.speed * (0.9 + ((i + index) % 3) * 0.1);
              
              return (
                <Snowflake 
                  key={`snow-from-cloud-${index}-${i}-${weatherCode}`} 
                  delay={i * 0.2 + index * 0.3} 
                  size={size}
                  className={snowClass}
                  style={{ 
                    left: `${(i * (isMobile ? 24 : 12)) % 100}%`,
                    animationDuration: `${15 / speed}s`,
                  }}
                />
              );
            })}
          </SnowCloudGroup>
        ))}
        <SnowWrapper className={weatherCode === 1117 ? 'blizzard' : ''}>
          {snowflakes}
        </SnowWrapper>
      </SnowContainer>
    </>
  );
};

export default Snow; 