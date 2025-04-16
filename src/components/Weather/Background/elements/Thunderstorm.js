import React, { useMemo } from 'react';
import { 
  CloudsContainer, 
  Cloud, 
  RainContainer,
  RainLayer,
  RainOverlay,
  ElegantRainDrop,
  ThunderOverlay,
  ThunderLightning
} from '../styles';

const Thunderstorm = ({ cloudComponents, weatherCode, isMobile }) => {
  // Determine thunderstorm characteristics based on weather code
  const thunderConfig = useMemo(() => {
    // Thundery outbreaks (1087)
    if (weatherCode === 1087) {
      return {
        thunderCloudCount: isMobile ? 3 : 5,
        lightningFrequency: 1.0, // Base frequency
        rainConfig: {
          enabled: false
        },
        lightningIntensity: 0.8
      };
    }
    // Patchy light rain with thunder (1273)
    else if (weatherCode === 1273) {
      return {
        thunderCloudCount: isMobile ? 3 : 5,
        lightningFrequency: 0.7,
        rainConfig: {
          enabled: true,
          intensity: 'light',
          backgroundCount: isMobile ? 20 : 40,
          middleCount: isMobile ? 15 : 30,
          foregroundCount: isMobile ? 8 : 15
        },
        lightningIntensity: 0.6
      };
    }
    // Moderate or heavy rain with thunder (1276)
    else if (weatherCode === 1276) {
      return {
        thunderCloudCount: isMobile ? 4 : 6,
        lightningFrequency: 1.2,
        rainConfig: {
          enabled: true,
          intensity: 'heavy',
          backgroundCount: isMobile ? 35 : 70,
          middleCount: isMobile ? 25 : 50,
          foregroundCount: isMobile ? 15 : 30
        },
        lightningIntensity: 1.0
      };
    }
    // Patchy light snow with thunder (1279)
    else if (weatherCode === 1279) {
      return {
        thunderCloudCount: isMobile ? 3 : 5,
        lightningFrequency: 0.8,
        rainConfig: {
          enabled: false
        },
        snowEnabled: true,
        snowIntensity: 'light',
        lightningIntensity: 0.7
      };
    }
    // Moderate or heavy snow with thunder (1282)
    else if (weatherCode === 1282) {
      return {
        thunderCloudCount: isMobile ? 4 : 6,
        lightningFrequency: 1.0,
        rainConfig: {
          enabled: false
        },
        snowEnabled: true,
        snowIntensity: 'heavy',
        lightningIntensity: 0.9
      };
    }
    // Default thunderstorm config
    return {
      thunderCloudCount: isMobile ? 3 : 5,
      lightningFrequency: 1.0,
      rainConfig: {
        enabled: true,
        intensity: 'moderate',
        backgroundCount: isMobile ? 30 : 60,
        middleCount: isMobile ? 20 : 40,
        foregroundCount: isMobile ? 10 : 20
      },
      lightningIntensity: 0.8
    };
  }, [weatherCode, isMobile]);

  // Generate raindrops if needed
  const raindrops = useMemo(() => {
    if (!thunderConfig.rainConfig.enabled) return null;
    
    // Create a seed for consistent randomization
    const seed = weatherCode * 100;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // Determine rain parameters based on intensity
    let opacityBase, speedBase, heightRange;
    const { intensity } = thunderConfig.rainConfig;
    
    if (intensity === 'light') {
      opacityBase = { background: 0.2, middle: 0.4, foreground: 0.6 };
      speedBase = { background: 0.6, middle: 0.8, foreground: 1.0 };
      heightRange = { background: [8, 15], middle: [10, 18], foreground: [15, 25] };
    } else if (intensity === 'heavy') {
      opacityBase = { background: 0.4, middle: 0.7, foreground: 0.9 };
      speedBase = { background: 0.9, middle: 1.2, foreground: 1.6 };
      heightRange = { background: [15, 25], middle: [20, 30], foreground: [25, 40] };
    } else { // moderate
      opacityBase = { background: 0.3, middle: 0.6, foreground: 0.8 };
      speedBase = { background: 0.7, middle: 1.0, foreground: 1.3 };
      heightRange = { background: [10, 20], middle: [15, 25], foreground: [20, 35] };
    }
    
    return {
      background: [...Array(thunderConfig.rainConfig.backgroundCount)].map((_, i) => ({
        key: `thunder-bg-rain-${i}-${weatherCode}`,
        left: seedRandom(i) * 100,
        delay: seedRandom(i + 100) * 3,
        opacity: opacityBase.background + seedRandom(i + 200) * 0.3,
        speed: speedBase.background + seedRandom(i + 300) * 0.3,
        height: heightRange.background[0] + seedRandom(i + 400) * 
                (heightRange.background[1] - heightRange.background[0])
      })),
      middle: [...Array(thunderConfig.rainConfig.middleCount)].map((_, i) => ({
        key: `thunder-md-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 500) * 100,
        delay: seedRandom(i + 600) * 2,
        opacity: opacityBase.middle + seedRandom(i + 700) * 0.2,
        speed: speedBase.middle + seedRandom(i + 800) * 0.2,
        height: heightRange.middle[0] + seedRandom(i + 900) * 
                (heightRange.middle[1] - heightRange.middle[0])
      })),
      foreground: [...Array(thunderConfig.rainConfig.foregroundCount)].map((_, i) => ({
        key: `thunder-fg-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 1000) * 100,
        delay: seedRandom(i + 1100) * 1.5,
        opacity: opacityBase.foreground + seedRandom(i + 1200) * 0.2,
        speed: speedBase.foreground + seedRandom(i + 1300) * 0.2,
        height: heightRange.foreground[0] + seedRandom(i + 1400) * 
                (heightRange.foreground[1] - heightRange.foreground[0])
      }))
    };
  }, [weatherCode, thunderConfig]);

  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, thunderConfig.thunderCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`thunder-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={true}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.6)', // Darker clouds for thunderstorms
              zIndex: 3
            }}
          />
        ))}
      </CloudsContainer>
      
      {/* Rain layers if enabled */}
      {thunderConfig.rainConfig.enabled && (
        <RainContainer>
          <RainLayer className={thunderConfig.rainConfig.intensity === 'heavy' ? 'background heavy' : 'background'}>
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
          <RainLayer className={thunderConfig.rainConfig.intensity === 'heavy' ? 'middle heavy' : 'middle'}>
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
          <RainLayer className={thunderConfig.rainConfig.intensity === 'heavy' ? 'foreground heavy' : 'foreground'}>
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
          <RainOverlay
            style={{ opacity: thunderConfig.rainConfig.intensity === 'heavy' ? 0.4 : 0.2 }}
          />
        </RainContainer>
      )}
      
      {/* Thunder effects */}
      <ThunderOverlay
        style={{
          animationDuration: `${7 / thunderConfig.lightningFrequency}s`
        }}
      />
      <ThunderLightning
        intensity={thunderConfig.lightningIntensity}
        className={weatherCode === 1276 ? 'intense' : ''}
        style={{
          animationDuration: `${7 / thunderConfig.lightningFrequency}s`
        }}
      />
    </>
  );
};

export default Thunderstorm; 