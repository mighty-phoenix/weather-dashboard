import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import background components
import { BackgroundContainer, GradientOverlay } from './styles';
import useBackgroundEffects from './hooks/useBackgroundEffects';
import ClearSky from './elements/ClearSky';
import CloudsComponent from './elements/Clouds';
import RainComponent from './elements/Rain';
import ThunderstormComponent from './elements/Thunderstorm';
import SnowComponent from './elements/Snow';
import FogComponent from './elements/Fog';

const WeatherBackground = ({ weatherData, isDay }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [weatherCode, setWeatherCode] = useState(1000);
  
  // Add resize listener to update mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update weather code whenever weather data changes
  useEffect(() => {
    if (weatherData && weatherData.current && weatherData.current.condition) {
      setWeatherCode(weatherData.current.condition.code);
    }
  }, [weatherData]);

  // Use custom hook for background calculations
  const { 
    backgroundGradient, 
    overlayGradient,
    sunPosition,
    moonPosition,
    cloudComponents
  } = useBackgroundEffects(weatherData, isDay, weatherCode, isMobile);
  
  // Render weather-specific elements
  const renderWeatherElements = useMemo(() => {
    if (!weatherData) return null;
    
    // Clear sky
    if (weatherCode === 1000) {
      return <ClearSky isDay={isDay} sunPosition={sunPosition} moonPosition={moonPosition} />;
    }
    
    // Clouds
    if (weatherCode >= 1003 && weatherCode <= 1030) {
      return <CloudsComponent 
        cloudComponents={cloudComponents} 
        isDay={isDay} 
        sunPosition={sunPosition} 
        moonPosition={moonPosition} 
      />;
    }
    
    // Rain
    if ((weatherCode >= 1063 && weatherCode <= 1072) || (weatherCode >= 1150 && weatherCode <= 1201)) {
      return <RainComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Thunderstorm with rain
    if ((weatherCode >= 1087 && weatherCode <= 1117) || (weatherCode >= 1273 && weatherCode <= 1282)) {
      return <ThunderstormComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Snow
    if ((weatherCode >= 1210 && weatherCode <= 1237) || 
        (weatherCode >= 1249 && weatherCode <= 1264)) {
      return <SnowComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Fog (default for other conditions)
    return <FogComponent weatherCode={weatherCode} isDay={isDay} />;
  }, [weatherCode, isDay, isMobile, cloudComponents, sunPosition, moonPosition, weatherData]);
  
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

export default WeatherBackground; 