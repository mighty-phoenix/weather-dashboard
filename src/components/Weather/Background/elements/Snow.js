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
  const snowCloudCount = isMobile ? 3 : 4;
  const snowflakesPerCloud = isMobile ? 3 : 6;
  
  // Generate snowflakes
  const snowflakes = useMemo(() => {
    const seed = weatherCode * 100;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    const snowflakeCount = isMobile ? 20 : 40;
    
    return [...Array(snowflakeCount)].map((_, i) => (
      <Snowflake 
        key={`snow-${i}-${weatherCode}`} 
        delay={i * 0.1} 
        size={seedRandom(i) * 0.8 + 0.8}
        style={{ left: `${(i * 2) % 100}%` }}
      />
    ));
  }, [weatherCode, isMobile]);
  
  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, snowCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`snow-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={true}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.9)',
              zIndex: 3
            }}
          />
        ))}
      </CloudsContainer>
      <SnowContainer>
        {cloudComponents.slice(0, snowCloudCount).map((cloudProps, index) => (
          <SnowCloudGroup 
            key={`snow-group-${index}-${weatherCode}`} 
            style={{ 
              left: cloudProps.style.left,
              top: `calc(${cloudProps.style.top} + 5%)`,
              width: `${200 * cloudProps.size}px`
            }}
          >
            {[...Array(snowflakesPerCloud)].map((_, i) => (
              <Snowflake 
                key={`snow-from-cloud-${index}-${i}-${weatherCode}`} 
                delay={i * 0.2 + index * 0.3} 
                size={0.8 + ((i + index) % 5) / 10}
                style={{ left: `${(i * (isMobile ? 24 : 12)) % 100}%` }}
              />
            ))}
          </SnowCloudGroup>
        ))}
        <SnowWrapper>
          {snowflakes}
        </SnowWrapper>
      </SnowContainer>
    </>
  );
};

export default Snow; 