import React from 'react';
import { 
  CloudsContainer, 
  Cloud, 
  BackgroundDarken,
  HeavyRainContainer,
  RainLayer,
  HeavyRainOverlay,
  ElegantHeavyRainDrop,
  ThunderOverlay,
  ThunderLightning,
  LightningFlash
} from '../styles';

const Thunderstorm = ({ cloudComponents, weatherCode, isMobile }) => {
  const thunderCloudCount = isMobile ? 3 : 5;
  
  return (
    <>
      <BackgroundDarken />
      <CloudsContainer>
        {cloudComponents.slice(0, thunderCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`thunder-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={true}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.7)',
              zIndex: 3,
              transform: 'scale(1.1)'
            }}
          />
        ))}
      </CloudsContainer>
      
      <ThunderOverlay />
      <LightningFlash />
      
      <HeavyRainContainer>
        <RainLayer className="background heavy">
          {[...Array(isMobile ? 30 : 60)].map((_, i) => (
            <ElegantHeavyRainDrop
              key={`heavy-bg-rain-${i}-${weatherCode}`}
              style={{
                left: `${(i * 1.7) % 100}%`,
                animationDelay: `${(i * 0.05) % 2}s`,
                opacity: 0.3 + (i % 7) / 20,
                height: `${15 + (i % 11)}px`,
                width: `${1 + (i % 3) / 2}px`,
                animationDuration: `${1.3 + (i % 5) / 10}s`
              }}
            />
          ))}
        </RainLayer>
        <RainLayer className="middle heavy">
          {[...Array(isMobile ? 20 : 40)].map((_, i) => (
            <ElegantHeavyRainDrop
              key={`heavy-md-rain-${i}-${weatherCode}`}
              style={{
                left: `${(i * 2.6) % 100}%`,
                animationDelay: `${(i * 0.08) % 1.5}s`,
                opacity: 0.5 + (i % 5) / 20,
                height: `${20 + (i % 10)}px`,
                width: `${1.5 + (i % 3) / 2}px`,
                animationDuration: `${1.1 + (i % 5) / 10}s`
              }}
            />
          ))}
        </RainLayer>
        <RainLayer className="foreground heavy">
          {[...Array(isMobile ? 12 : 20)].map((_, i) => (
            <ElegantHeavyRainDrop
              key={`heavy-fg-rain-${i}-${weatherCode}`}
              style={{
                left: `${(i * 5.1) % 100}%`,
                animationDelay: `${(i * 0.13) % 1.5}s`,
                opacity: 0.6 + (i % 4) / 10,
                height: `${25 + (i % 10)}px`,
                width: `${1.8 + (i % 3) / 2}px`,
                animationDuration: `${0.9 + (i % 5) / 10}s`
              }}
            />
          ))}
        </RainLayer>
        <HeavyRainOverlay />
      </HeavyRainContainer>
      
      <ThunderLightning />
    </>
  );
};

export default Thunderstorm; 