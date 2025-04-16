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
  // Determine rain characteristics based on weather code
  const rainConfig = useMemo(() => {
    // Light drizzle or patchy light rain (1150-1153, 1180, 1240)
    if ((weatherCode >= 1150 && weatherCode <= 1153) || 
        weatherCode === 1180 || 
        weatherCode === 1240) {
      return {
        rainCloudCount: isMobile ? 2 : 4,
        backgroundCount: isMobile ? 20 : 40,
        middleCount: isMobile ? 15 : 30,
        foregroundCount: isMobile ? 8 : 15,
        opacity: {
          background: 0.2,
          middle: 0.5,
          foreground: 0.7
        },
        height: {
          background: [8, 15],
          middle: [12, 18], 
          foreground: [15, 22]
        },
        speed: {
          background: 0.6,
          middle: 0.8,
          foreground: 1.0
        }
      };
    }
    // Moderate rain (1183, 1186-1189, 1243)
    else if (weatherCode === 1183 || 
             (weatherCode >= 1186 && weatherCode <= 1189) || 
             weatherCode === 1243) {
      return {
        rainCloudCount: isMobile ? 3 : 5,
        backgroundCount: isMobile ? 30 : 60,
        middleCount: isMobile ? 20 : 40,
        foregroundCount: isMobile ? 10 : 20,
        opacity: {
          background: 0.3,
          middle: 0.6, 
          foreground: 0.8
        },
        height: {
          background: [10, 18],
          middle: [15, 25],
          foreground: [20, 30]
        },
        speed: {
          background: 0.7,
          middle: 1.0,
          foreground: 1.3
        }
      };
    }
    // Heavy rain or torrential (1192-1195, 1246)
    else if ((weatherCode >= 1192 && weatherCode <= 1195) || weatherCode === 1246) {
      return {
        rainCloudCount: isMobile ? 4 : 6,
        backgroundCount: isMobile ? 40 : 80,
        middleCount: isMobile ? 30 : 60,
        foregroundCount: isMobile ? 15 : 30,
        opacity: {
          background: 0.4,
          middle: 0.7,
          foreground: 0.9
        },
        height: {
          background: [15, 25],
          middle: [20, 35],
          foreground: [25, 45]
        },
        speed: {
          background: 0.9,
          middle: 1.3,
          foreground: 1.7
        }
      };
    }
    // Freezing rain (1168-1171, 1198-1201)
    else if ((weatherCode >= 1168 && weatherCode <= 1171) || 
             (weatherCode >= 1198 && weatherCode <= 1201)) {
      return {
        rainCloudCount: isMobile ? 3 : 5,
        backgroundCount: isMobile ? 30 : 60,
        middleCount: isMobile ? 20 : 40,
        foregroundCount: isMobile ? 12 : 25,
        opacity: {
          background: 0.3,
          middle: 0.6,
          foreground: 0.75
        },
        height: {
          background: [8, 16],
          middle: [12, 22],
          foreground: [16, 28]
        },
        speed: {
          background: 0.6,
          middle: 0.8,
          foreground: 1.0
        }
      };
    }
    // Patchy rain (1063, 1072)
    else if (weatherCode === 1063 || weatherCode === 1072) {
      return {
        rainCloudCount: isMobile ? 2 : 3,
        backgroundCount: isMobile ? 15 : 30,
        middleCount: isMobile ? 10 : 20,
        foregroundCount: isMobile ? 5 : 10,
        opacity: {
          background: 0.2,
          middle: 0.4,
          foreground: 0.6
        },
        height: {
          background: [8, 15],
          middle: [10, 18],
          foreground: [12, 20]
        },
        speed: {
          background: 0.5,
          middle: 0.7,
          foreground: 0.9
        }
      };
    }
    // Default rain configuration
    return {
      rainCloudCount: isMobile ? 3 : 5,
      backgroundCount: isMobile ? 30 : 60,
      middleCount: isMobile ? 20 : 40,
      foregroundCount: isMobile ? 10 : 20,
      opacity: {
        background: 0.3,
        middle: 0.6,
        foreground: 0.8
      },
      height: {
        background: [10, 20],
        middle: [15, 30],
        foreground: [20, 40]
      },
      speed: {
        background: 0.7,
        middle: 1.0,
        foreground: 1.3
      }
    };
  }, [weatherCode, isMobile]);
  
  // Generate raindrops
  const raindrops = useMemo(() => {
    // Create a seed for consistent randomization
    const seed = weatherCode * 100;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    return {
      background: [...Array(rainConfig.backgroundCount)].map((_, i) => ({
        key: `bg-rain-${i}-${weatherCode}`,
        left: seedRandom(i) * 100,
        delay: seedRandom(i + 100) * 3,
        opacity: rainConfig.opacity.background + seedRandom(i + 200) * 0.3,
        speed: rainConfig.speed.background + seedRandom(i + 300) * 0.3,
        height: rainConfig.height.background[0] + seedRandom(i + 400) * 
                (rainConfig.height.background[1] - rainConfig.height.background[0])
      })),
      middle: [...Array(rainConfig.middleCount)].map((_, i) => ({
        key: `md-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 500) * 100,
        delay: seedRandom(i + 600) * 2,
        opacity: rainConfig.opacity.middle + seedRandom(i + 700) * 0.2,
        speed: rainConfig.speed.middle + seedRandom(i + 800) * 0.2,
        height: rainConfig.height.middle[0] + seedRandom(i + 900) * 
                (rainConfig.height.middle[1] - rainConfig.height.middle[0])
      })),
      foreground: [...Array(rainConfig.foregroundCount)].map((_, i) => ({
        key: `fg-rain-${i}-${weatherCode}`,
        left: seedRandom(i + 1000) * 100,
        delay: seedRandom(i + 1100) * 1.5,
        opacity: rainConfig.opacity.foreground + seedRandom(i + 1200) * 0.2,
        speed: rainConfig.speed.foreground + seedRandom(i + 1300) * 0.2,
        height: rainConfig.height.foreground[0] + seedRandom(i + 1400) * 
                (rainConfig.height.foreground[1] - rainConfig.height.foreground[0])
      }))
    };
  }, [weatherCode, rainConfig]);

  return (
    <>
      <CloudsContainer>
        {cloudComponents.slice(0, rainConfig.rainCloudCount).map((cloudProps, index) => (
          <Cloud
            key={`rain-cloud-${index}-${weatherCode}`}
            delay={cloudProps.delay}
            size={cloudProps.size}
            dark={cloudProps.dark}
            style={{
              ...cloudProps.style,
              filter: 'brightness(0.8)',
              zIndex: 3
            }}
          />
        ))}
      </CloudsContainer>
      <RainContainer>
        <RainLayer className={weatherCode >= 1192 ? 'background heavy' : 'background'}>
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
        <RainLayer className={weatherCode >= 1192 ? 'middle heavy' : 'middle'}>
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
        <RainLayer className={weatherCode >= 1192 ? 'foreground heavy' : 'foreground'}>
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
          style={{ 
            opacity: weatherCode >= 1192 ? 0.4 : 
                    (weatherCode >= 1186 ? 0.3 : 0.2) 
          }}
        />
      </RainContainer>
    </>
  );
};

export default Rain; 