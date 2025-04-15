import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';

const WeatherBackground = ({ weatherData, isDay }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunPosition, setSunPosition] = useState(0);
  const [moonPosition, setMoonPosition] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#4facfe', '#00f2fe']);
  const [gradientDirection, setGradientDirection] = useState(135);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)');
  const [weatherCode, setWeatherCode] = useState(1000);
  const [overlayGradient, setOverlayGradient] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Add resize listener to update mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update weather code whenever weather data changes
  useEffect(() => {
    if (weatherData) {
      setWeatherCode(weatherData.current.condition.code);
    }
  }, [weatherData]);
  
  // Calculate sun and moon positions based on time of day
  useEffect(() => {
    if (!weatherData) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    try {
      // Parse sunrise and sunset times
      if (weatherData.forecast?.forecastday?.[0]?.astro) {
        const sunriseTime = weatherData.forecast.forecastday[0].astro.sunrise;
        const sunsetTime = weatherData.forecast.forecastday[0].astro.sunset;
        
        const riseParts = sunriseTime.split(/[: ]/);
        const setParts = sunsetTime.split(/[: ]/);
        
        let riseHours = parseInt(riseParts[0]);
        const riseMinutes = parseInt(riseParts[1]);
        if (riseParts[2]?.toLowerCase() === 'pm') riseHours += 12;
        
        let setHours = parseInt(setParts[0]);
        const setMinutes = parseInt(setParts[1]);
        if (setParts[2]?.toLowerCase() === 'pm') setHours += 12;
        
        const riseInMinutes = riseHours * 60 + riseMinutes;
        const setInMinutes = setHours * 60 + setMinutes;
        
        // Calculate sun position (0-100%)
        let sunPos = 0;
        if (timeInMinutes < riseInMinutes) {
          // Before sunrise
          sunPos = 0;
        } else if (timeInMinutes < setInMinutes) {
          // During day
          const dayLength = setInMinutes - riseInMinutes;
          const dayProgress = timeInMinutes - riseInMinutes;
          sunPos = (dayProgress / dayLength) * 100;
        } else {
          // After sunset
          sunPos = 100;
        }
        
        // Calculate moon position (0-100%)
        let moonPos = 0;
        if (timeInMinutes < setInMinutes) {
          // Before sunset
          moonPos = 0;
        } else {
          // After sunset
          const nightLength = 24 * 60 - (setInMinutes - riseInMinutes);
          const nightProgress = timeInMinutes - setInMinutes;
          moonPos = (nightProgress / nightLength) * 100;
        }
        
        setSunPosition(sunPos);
        setMoonPosition(moonPos);
        
        // Update direction less frequently - only every hour
        if (currentTime.getMinutes() === 0) {
          const timeRatio = (hours % 24) / 24;
          const newDirection = Math.floor(timeRatio * 360);
          setGradientDirection(newDirection);
        }
      }
    } catch (error) {
      console.error("Error parsing sun/moon positions:", error);
    }
  }, [weatherData, currentTime]);
  
  // Create overlay gradient based on time and colors
  useEffect(() => {
    const randomX = Math.floor(((currentTime.getHours() * 60 + currentTime.getMinutes()) % 100));
    const randomY = Math.floor(((currentTime.getHours() * 60 + currentTime.getMinutes()) % 100));
    
    const gradient = `radial-gradient(circle at ${randomX}% ${randomY}%, 
      ${chroma(gradientColors[0]).alpha(0.2).css()} 0%, 
      ${chroma(gradientColors[1]).alpha(0.4).css()} 50%, 
      ${chroma(gradientColors[0]).alpha(0.3).css()} 100%)`;
    
    setOverlayGradient(gradient);
  }, [gradientColors, currentTime]);
  
  // Calculate background gradient based on weather and time of day
  useEffect(() => {
    let newColors = [...gradientColors];
    let gradientString = '';
    
    // Clear sky
    if (weatherCode === 1000) {
      if (isDay) {
        const sunProgress = sunPosition / 100;
        const color1 = chroma.mix('#4facfe', '#ff9a9e', sunProgress * 0.5, 'lab');
        const color2 = chroma.mix('#00f2fe', '#fad0c4', sunProgress * 0.5, 'lab');
        newColors = [color1.hex(), color2.hex()];
        gradientString = `linear-gradient(${gradientDirection}deg, ${color1.hex()} 0%, ${color2.hex()} 100%)`;
      } else {
        const moonProgress = moonPosition / 100;
        const color1 = chroma.mix('#0c1445', '#30cfd0', moonProgress * 0.3, 'lab');
        const color2 = chroma.mix('#203a8f', '#330867', moonProgress * 0.3, 'lab');
        newColors = [color1.hex(), color2.hex()];
        gradientString = `linear-gradient(${gradientDirection}deg, ${color1.hex()} 0%, ${color2.hex()} 100%)`;
      }
    }
    
    // Partly cloudy
    else if (weatherCode === 1003) {
      if (isDay) {
        newColors = ['#5583EE', '#41D8DD'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      } else {
        newColors = ['#12132e', '#2b4a8f'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      }
    }
    
    // Cloudy
    else if (weatherCode >= 1006 && weatherCode <= 1030) {
      if (isDay) {
        newColors = ['#6a85b6', '#bac8e0'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      } else {
        newColors = ['#25273c', '#333b5f'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      }
    }
    
    // Rain
    else if ((weatherCode >= 1063 && weatherCode <= 1072) || (weatherCode >= 1150 && weatherCode <= 1201)) {
      if (isDay) {
        newColors = ['#1c92d2', '#7ac4e6'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      } else {
        newColors = ['#141E30', '#243B55'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      }
    }
    
    // Thunderstorm with rain
    else if ((weatherCode >= 1087 && weatherCode <= 1117) || (weatherCode >= 1273 && weatherCode <= 1282)) {
      if (isDay) {
        newColors = ['#2c3e50', '#4ca1af'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      } else {
        newColors = ['#0f2027', '#203a43'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      }
    }
    
    // Snow (without thunder)
    else if ((weatherCode >= 1210 && weatherCode <= 1237) || 
            (weatherCode >= 1249 && weatherCode <= 1264)) {
      if (isDay) {
        newColors = ['#E6DADA', '#8CA6DB'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      } else {
        newColors = ['#2C3E50', '#4CA1AF'];
        gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
      }
    }
    
    // Fog
    else {
      newColors = isDay ? ['#b8c6db', '#f5f7fa'] : ['#2c3e50', '#4ca1af'];
      gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
    }
    
    // Update state with new colors and gradient
    setGradientColors(newColors);
    setBackgroundGradient(gradientString);
  }, [weatherCode, isDay, sunPosition, moonPosition, gradientDirection, gradientColors]);
  
  // Generate cloud components
  const cloudComponents = useMemo(() => {
    if (!weatherData) return [];
    
    // Use a seed based on weather code to keep cloud positions stable
    const seed = weatherCode * 100 + (isDay ? 1 : 0);
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // Reduce number of clouds on mobile
    const cloudCount = isMobile ? 4 : 10;
    
    return [...Array(cloudCount)].map((_, i) => {
      // Distribute clouds more evenly across the vertical space
      const rowIndex = i % (isMobile ? 3 : 4); 
      const verticalSection = rowIndex * (isMobile ? 33 : 25);
      
      // Horizontal distribution with proper spacing
      const horizontalSection = (i % (isMobile ? 2 : 3)) * (isMobile ? 60 : 40);
      
      const top = verticalSection + seedRandom(i * 2) * 15;
      const left = horizontalSection - 20 + seedRandom(i * 2 + 1) * 25;
      const size = 1 + seedRandom(i) * 0.5;
      
      return (
        <Cloud 
          key={`cloud-${i}-${weatherCode}`} 
          delay={i * 1.5 + seedRandom(i) * 2}
          size={size} 
          dark={weatherCode >= 1063}
          style={{ 
            top: `${top}%`,
            left: `${left}%`,
            zIndex: 1 + Math.floor(seedRandom(i + 12) * 3)
          }}
        />
      );
    });
  }, [weatherCode, isDay, isMobile, weatherData]);
  
  // Generate raindrops
  const raindrops = useMemo(() => {
    const isRain = (weatherCode >= 1063 && weatherCode <= 1072) || 
                  (weatherCode >= 1150 && weatherCode <= 1201);
    if (!isRain) return { background: [], middle: [], foreground: [] };
    
    // Create a seed for consistent randomization
    const seed = weatherCode * 100 + (isDay ? 1 : 0);
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
  }, [weatherCode, isDay, isMobile]);
  
  // Generate snowflakes
  const snowflakes = useMemo(() => {
    const isSnow = (weatherCode >= 1210 && weatherCode <= 1237) || 
                  (weatherCode >= 1249 && weatherCode <= 1264);
    if (!isSnow) return [];
    
    const seed = weatherCode * 100 + (isDay ? 1 : 0);
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
  }, [weatherCode, isDay, isMobile]);
  
  // Generate fog layers
  const fogLayers = useMemo(() => {
    const isFog = weatherCode > 1030 && 
                 !(weatherCode >= 1063 && weatherCode <= 1072) && 
                 !(weatherCode >= 1150 && weatherCode <= 1201) &&
                 !(weatherCode >= 1210 && weatherCode <= 1237) && 
                 !(weatherCode >= 1249 && weatherCode <= 1264) &&
                 !(weatherCode >= 1087 && weatherCode <= 1117) && 
                 !(weatherCode >= 1273 && weatherCode <= 1282);
    
    if (!isFog) return [];
    
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
  
  // Render weather-specific elements
  const renderWeatherElements = useMemo(() => {
    if (!weatherData) return null;
    
    // Clear sky - sun or moon
    if (weatherCode === 1000) {
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
    }
    
    // Clouds
    if (weatherCode >= 1003 && weatherCode <= 1030) {
      return (
        <>
          <Clouds>
            {cloudComponents}
          </Clouds>
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
    }
    
    // Rain
    if ((weatherCode >= 1063 && weatherCode <= 1072) || (weatherCode >= 1150 && weatherCode <= 1201)) {
      const rainCloudCount = isMobile ? 3 : 5;
      return (
        <>
          <Clouds>
            {cloudComponents.slice(0, rainCloudCount).map((cloud, index) => (
              <React.Fragment key={`rain-cloud-${index}-${weatherCode}`}>
                {React.cloneElement(cloud, {
                  dark: true,
                  style: {
                    ...cloud.props.style,
                    filter: 'brightness(0.8)',
                    zIndex: 3
                  }
                })}
              </React.Fragment>
            ))}
          </Clouds>
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
    }
    
    // Thunderstorm with rain
    if ((weatherCode >= 1087 && weatherCode <= 1117) || (weatherCode >= 1273 && weatherCode <= 1282)) {
      const thunderCloudCount = isMobile ? 3 : 5;
      return (
        <>
          <BackgroundDarken />
          <Clouds>
            {cloudComponents.slice(0, thunderCloudCount).map((cloud, index) => (
              <React.Fragment key={`thunder-cloud-${index}-${weatherCode}`}>
                {React.cloneElement(cloud, {
                  dark: true,
                  style: {
                    ...cloud.props.style,
                    filter: 'brightness(0.7)',
                    zIndex: 3,
                    transform: 'scale(1.1)'
                  }
                })}
              </React.Fragment>
            ))}
          </Clouds>
          
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
    }
    
    // Snow
    if ((weatherCode >= 1210 && weatherCode <= 1237) || 
        (weatherCode >= 1249 && weatherCode <= 1264)) {
      const snowCloudCount = isMobile ? 3 : 4;
      const snowflakesPerCloud = isMobile ? 3 : 6;
      return (
        <>
          <Clouds>
            {cloudComponents.slice(0, snowCloudCount).map((cloud, index) => (
              <React.Fragment key={`snow-cloud-${index}-${weatherCode}`}>
                {React.cloneElement(cloud, {
                  dark: true,
                  style: {
                    ...cloud.props.style,
                    filter: 'brightness(0.9)',
                    zIndex: 3
                  }
                })}
              </React.Fragment>
            ))}
          </Clouds>
          <SnowContainer>
            {cloudComponents.slice(0, snowCloudCount).map((cloud, index) => (
              <SnowCloudGroup key={`snow-group-${index}-${weatherCode}`} style={{ 
                left: cloud.props.style.left,
                top: `calc(${cloud.props.style.top} + 5%)`,
                width: `${200 * cloud.props.size}px`
              }}>
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
            <Snow>
              {snowflakes}
            </Snow>
          </SnowContainer>
        </>
      );
    }
    
    // Fog (default for other conditions)
    return (
      <Fog>
        {fogLayers}
      </Fog>
    );
  }, [weatherCode, isDay, isMobile, cloudComponents, raindrops, snowflakes, fogLayers, weatherData]);
  
  return (
    <BackgroundContainer style={{ background: backgroundGradient }}>
      <GradientOverlay
        style={{ background: overlayGradient }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`weather-${weatherCode}-${isDay ? 'day' : 'night'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {renderWeatherElements}
        </motion.div>
      </AnimatePresence>
    </BackgroundContainer>
  );
};

// Styled Components
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background 2s ease-in-out;
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: overlay;
  transition: background 2s ease-in-out;
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.visible ? (props.opacity || 1) : 0};
  transition: opacity 2s ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(white 1px, transparent 1px), 
                      radial-gradient(white 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: 0 0, 25px 25px;
    animation: twinkle 5s ease-in-out infinite alternate;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(white 1px, transparent 1px), 
                      radial-gradient(white 0.5px, transparent 0.5px);
    background-size: 100px 100px;
    background-position: 10px 10px, 55px 55px;
    animation: twinkle 7s ease-in-out infinite alternate;
    animation-delay: 1s;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

const Sun = styled(motion.div)`
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,200,0,0.8) 50%, rgba(255,150,0,0) 100%);
  border-radius: 50%;
  box-shadow: 0 0 80px rgba(255, 200, 0, 0.8);
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: ${props => props.opacity || 1};
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,200,0,0) 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 5s infinite alternate;
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
  }
`;

const Moon = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,200,220,0.8) 50%, rgba(150,150,180,0) 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: ${props => props.opacity || 1};
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 20%;
    height: 20%;
    background: rgba(200, 200, 220, 0.8);
    border-radius: 50%;
    box-shadow: 30px 10px 0 -5px rgba(200, 200, 220, 0.8),
                60px 30px 0 -5px rgba(200, 200, 220, 0.8),
                30px 50px 0 -5px rgba(200, 200, 220, 0.8);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,220,0) 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: moonGlow 6s infinite alternate;
  }
  
  @keyframes moonGlow {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
  }
`;

const Clouds = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Cloud = styled(motion.div)`
  position: absolute;
  width: ${props => 200 * (props.size || 1)}px;
  height: ${props => 80 * (props.size || 1)}px;
  background: ${props => props.dark ? 'rgba(70, 70, 90, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 50px;
  box-shadow: 0 0 40px ${props => props.dark ? 'rgba(50, 50, 70, 0.7)' : 'rgba(255, 255, 255, 0.5)'};
  filter: ${props => props.dark ? 'brightness(0.8)' : 'none'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${props => props.dark ? 'rgba(70, 70, 90, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
    border-radius: 50%;
  }
  
  &::before {
    width: ${props => 100 * (props.size || 1)}px;
    height: ${props => 100 * (props.size || 1)}px;
    top: ${props => -50 * (props.size || 1)}px;
    left: ${props => 30 * (props.size || 1)}px;
  }
  
  &::after {
    width: ${props => 120 * (props.size || 1)}px;
    height: ${props => 120 * (props.size || 1)}px;
    top: ${props => -60 * (props.size || 1)}px;
    right: ${props => 30 * (props.size || 1)}px;
  }
  
  animation: float ${props => 80 + props.delay}s linear infinite;
  opacity: ${() => 0.8 + Math.random() * 0.2};
  
  @keyframes float {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 300px)); }
  }
`;

const RainContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
`;

const RainLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 3;
  
  &.background {
    z-index: 2;
  }
  
  &.middle {
    z-index: 3;
  }
  
  &.foreground {
    z-index: 4;
  }
  
  &.heavy {
    filter: blur(0.3px);
  }
`;

const HeavyRainContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 4;
`;

const Snow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SnowContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
`;

const SnowCloudGroup = styled.div`
  position: absolute;
  height: 400px;
  overflow: visible;
  z-index: 3;
`;

const ThunderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 2;
  animation: thunderOverlayAnimation 7s infinite;
  pointer-events: none;
  
  @keyframes thunderOverlayAnimation {
    0%, 93%, 96%, 98%, 100% {
      background: transparent;
    }
    94%, 95%, 97% {
      background: rgba(120, 170, 255, 0.05);
    }
    95.5% {
      background: rgba(180, 215, 255, 0.1);
    }
  }
`;

const ThunderLightning = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: #fff;
    box-shadow: 0 0 30px rgba(255, 255, 255, 1), 
                0 0 60px rgba(255, 252, 205, 0.8), 
                0 0 100px rgba(255, 247, 168, 0.6);
    opacity: 0;
    z-index: 5;
    clip-path: polygon(
      50% 0%, 
      45% 30%, 
      60% 35%, 
      40% 60%, 
      55% 65%, 
      30% 100%, 
      45% 60%, 
      25% 55%, 
      50% 30%, 
      35% 25%
    );
  }
  
  /* Primary lightning bolt */
  &::before {
    top: 5%;
    left: 30%;
    width: 5px;
    height: 0;
    transform-origin: top;
    transform: rotate(-10deg) scaleY(0);
    animation: primaryLightning 7s infinite;
  }
  
  /* Secondary lightning bolt */
  &::after {
    top: 10%;
    left: 60%;
    width: 5px;
    height: 0;
    transform-origin: top;
    transform: rotate(10deg) scaleY(0);
    animation: secondaryLightning 7s infinite;
  }
  
  /* Add tertiary lightning bolt */
  &::after {
    content: '';
    position: absolute;
    top: 15%;
    left: 45%;
    width: 4px;
    height: 0;
    background: #fff;
    box-shadow: 0 0 30px rgba(255, 255, 255, 1),
                0 0 50px rgba(220, 240, 255, 0.8);
    opacity: 0;
    transform-origin: top;
    transform: rotate(5deg) scaleY(0);
    animation: tertiaryLightning 7s infinite;
    clip-path: polygon(
      50% 0%,
      40% 40%,
      55% 45%,
      35% 75%,
      60% 60%,
      45% 100%,
      65% 70%,
      40% 60%
    );
    z-index: 5;
  }
  
  @keyframes primaryLightning {
    0%, 94%, 98% { 
      height: 0; 
      opacity: 0; 
      transform: rotate(-10deg) scaleY(0);
    }
    94.5%, 95.5% { 
      height: 400px;
      opacity: 1; 
      transform: rotate(-10deg) scaleY(1);
    }
    96%, 97% { 
      height: 400px;
      opacity: 0.8; 
      transform: rotate(-10deg) scaleY(1);
    }
  }
  
  @keyframes secondaryLightning {
    0%, 42%, 46%, 100% { 
      height: 0; 
      opacity: 0; 
      transform: rotate(10deg) scaleY(0);
    }
    42.5%, 43.5% { 
      height: 300px;
      opacity: 1; 
      transform: rotate(10deg) scaleY(1);
    }
    44%, 45% { 
      height: 300px;
      opacity: 0.7; 
      transform: rotate(10deg) scaleY(1);
    }
  }
  
  @keyframes tertiaryLightning {
    0%, 15%, 19%, 100% { 
      height: 0; 
      opacity: 0; 
      transform: rotate(5deg) scaleY(0);
    }
    15.5%, 16.5% { 
      height: 350px;
      opacity: 1; 
      transform: rotate(5deg) scaleY(1);
    }
    17%, 18% { 
      height: 350px;
      opacity: 0.7; 
      transform: rotate(5deg) scaleY(1);
    }
  }
`;

// Add a darkening layer for thunderstorms
const BackgroundDarken = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 15, 35, 0.4);
  z-index: 1;
`;

const RainOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom,
    rgba(200, 230, 255, 0) 0%,
    rgba(200, 230, 255, 0.02) 50%,
    rgba(200, 230, 255, 0.03) 100%
  );
  pointer-events: none;
  z-index: 5;
`;

const HeavyRainOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom,
    rgba(200, 230, 255, 0) 0%,
    rgba(200, 230, 255, 0.03) 40%,
    rgba(200, 230, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 5;
`;



const ElegantRainDrop = styled.div`
  position: absolute;
  width: 1px;
  background: linear-gradient(to bottom, 
    rgba(220, 240, 255, 0.1) 0%, 
    rgba(240, 250, 255, 0.8) 20%, 
    rgba(240, 250, 255, 0.3) 100%
  );
  top: -100px;
  animation: elegantRain linear infinite;
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  will-change: transform;
  
  @keyframes elegantRain {
    0% {
      transform: translateY(-100px);
      animation-timing-function: ease-in;
    }
    30% {
      animation-timing-function: linear;
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;

const ElegantHeavyRainDrop = styled.div`
  position: absolute;
  background: linear-gradient(to bottom, 
    rgba(220, 240, 255, 0.1) 0%, 
    rgba(240, 250, 255, 0.9) 30%, 
    rgba(240, 250, 255, 0.4) 100%
  );
  top: -150px;
  animation: elegantHeavyRain linear infinite;
  box-shadow: 0 0 2px rgba(200, 230, 255, 0.2);
  will-change: transform;
  
  @keyframes elegantHeavyRain {
    0% {
      transform: translateY(-150px);
      animation-timing-function: ease-in;
    }
    40% {
      animation-timing-function: linear;
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;

const Fog = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const FogLayer = styled(motion.div)`
  position: absolute;
  width: 200%;
  background: linear-gradient(to right, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.4) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  left: -100%;
  animation: fog ${props => 60 + props.delay}s linear infinite;
  filter: blur(8px);
  
  @keyframes fog {
    0% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
`;

// Add back the Snowflake component
const Snowflake = styled(motion.div)`
  position: absolute;
  width: ${props => 10 * (props.size || 1)}px;
  height: ${props => 10 * (props.size || 1)}px;
  background: white;
  border-radius: 50%;
  top: 0;
  opacity: 0.8;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: snow ${() => 15 + Math.random() * 10}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1;
  transform-origin: center;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
  
  &::before {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: rotate(45deg);
  }
  
  &::after {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: rotate(90deg);
  }
  
  @keyframes snow {
    0% { 
      transform: translateY(0) rotate(0deg); 
      opacity: 0; 
    }
    10% {
      opacity: 0.8;
      transform: translateY(10px) rotate(30deg);
    }
    90% {
      opacity: 0.6;
    }
    100% { 
      transform: translateY(300px) rotate(360deg); 
      opacity: 0; 
    }
  }
`;

// After the ThunderOverlay component, add a more powerful flash effect:

const LightningFlash = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 10;
  pointer-events: none;
  animation: lightningFlashEffect 7s infinite;
  mix-blend-mode: screen;
  
  @keyframes lightningFlashEffect {
    0%, 42.4%, 43.6%, 94.4%, 95.6%, 96.4%, 97.6%, 100% { 
      background: transparent; 
    }
    42.5%, 43.5% { 
      background: rgba(200, 230, 255, 0.2);
    }
    95.5% { 
      background: rgba(220, 240, 255, 0.35);
    }
    96.5%, 97.5% { 
      background: rgba(180, 215, 255, 0.25);
    }
  }
`;

export default WeatherBackground; 