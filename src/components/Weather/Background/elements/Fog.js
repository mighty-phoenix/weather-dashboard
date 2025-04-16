import React, { useMemo } from 'react';
import { Fog as FogWrapper, FogLayer } from '../styles';

const Fog = ({ weatherCode, isDay }) => {
  const fogLayers = useMemo(() => {
    const seed = weatherCode * 100 + (isDay ? 1 : 0);
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    return [...Array(5)].map((_, i) => (
      <FogLayer 
        key={`fog-${i}-${weatherCode}`} 
        delay={i * 3}
        style={{ 
          height: `${20 + seedRandom(i) * 30}%`,
          top: `${i * 20}%`
        }}
      />
    ));
  }, [weatherCode, isDay]);

  return (
    <FogWrapper>
      {fogLayers}
    </FogWrapper>
  );
};

export default Fog; 