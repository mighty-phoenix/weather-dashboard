import React, { useMemo } from 'react';
import { 
  CloudsContainer, 
  Cloud, 
  RainContainer,
  RainLayer,
  RainOverlay,
  ElegantRainDrop
} from '../styles';

const Rain = ({ cloudComponents, weatherCode, isMobile }) => {
  const rainCloudCount = isMobile ? 3 : 5;
  
  // Generate raindrops
  const raindrops = useMemo(() => {
    // Create a seed for consistent randomization
    const seed = weatherCode * 100;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // Adjust counts based on device
    const backgroundCount = isMobile ? 30 : 60;
    const middleCount = isMobile ? 20 : 40;
    const foregroundCount = isMobile ? 10 : 20;
    
    return {
      background: [...Array(backgroundCount)].map((_, i) => ({
        key: `bg-rain-${i}-${weatherCode}`,
        left: seedRandom(i) * 100,
        delay: seedRandom(i + 100) * 3,
        opacity: 0.3 + seedRandom(i + 200) * 0.3,
        speed: 0.7 + seedRandom(i + 300) * 0.3,
        height: 10 + seedRandom(i + 400) * 10
      })),
      middle: [...Array(middleCount)].map((_, i) => ({
        key: `md-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 500) * 100,
        delay: seedRandom(i + 600) * 2,
        opacity: 0.6 + seedRandom(i + 700) * 0.2,
        speed: 1 + seedRandom(i + 800) * 0.2,
        height: 15 + seedRandom(i + 900) * 15
      })),
      foreground: [...Array(foregroundCount)].map((_, i) => ({
        key: `fg-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 1000) * 100,
        delay: seedRandom(i + 1100) * 1.5,
        opacity: 0.6 + seedRandom(i + 1200) * 0.3,
        speed: 1.3 + seedRandom(i + 1300) * 0.2,
        height: 20 + seedRandom(i + 1400) * 20
      }))
    };
  }, [weatherCode, isMobile]);

  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, rainCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`rain-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={true}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.8)',
              zIndex: 3
            }}
          />
        ))}
      </CloudsContainer>
      <RainContainer>
        <RainLayer className="background">
          {raindrops.background.map(drop => (
            <ElegantRainDrop
              key={drop.key}
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                opacity: drop.opacity,
                height: `${drop.height}px`,
                animationDuration: `${2.8 / drop.speed}s`
              }}
            />
          ))}
        </RainLayer>
        <RainLayer className="middle">
          {raindrops.middle.map(drop => (
            <ElegantRainDrop
              key={drop.key}
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                opacity: drop.opacity,
                height: `${drop.height}px`,
                animationDuration: `${2.5 / drop.speed}s`
              }}
            />
          ))}
        </RainLayer>
        <RainLayer className="foreground">
          {raindrops.foreground.map(drop => (
            <ElegantRainDrop
              key={drop.key}
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                opacity: drop.opacity,
                height: `${drop.height}px`,
                animationDuration: `${2.2 / drop.speed}s`
              }}
            />
          ))}
        </RainLayer>
        <RainOverlay />
      </RainContainer>
    </>
  );
};

export default Rain; 