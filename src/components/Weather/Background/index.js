import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import background components
import { BackgroundContainer, GradientOverlay, Sun, Moon } from './styles';
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
  const [prevWeatherCode, setPrevWeatherCode] = useState(null);
  
  // Add resize listener to update mobile detection with debouncing for performance
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 250); // Add debounce of 250ms to avoid excessive updates
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update weather code whenever weather data changes
  useEffect(() => {
    if (weatherData && weatherData.current && weatherData.current.condition) {
      if (weatherCode !== weatherData.current.condition.code) {
        setPrevWeatherCode(weatherCode);
        setWeatherCode(weatherData.current.condition.code);
      }
    }
  }, [weatherData, weatherCode]);

  // Use custom hook for background calculations
  const { 
    backgroundGradient, 
    overlayGradient,
    sunPosition,
    moonPosition,
    cloudComponents
  } = useBackgroundEffects(weatherData, isDay, weatherCode, isMobile);
  
  // Get friendly weather type for animation keys - memoized
  const getWeatherType = useCallback((code) => {
    // Clear sky
    if (code === 1000) return 'clear';
    
    // Clouds (partly cloudy, cloudy, overcast)
    if (code >= 1003 && code <= 1009) return 'cloudy';
    
    // Mist, fog, freezing fog
    if ([1030, 1135, 1147].includes(code)) return 'fog';
    
    // Rain conditions
    if ((code >= 1063 && code <= 1072) || 
        (code >= 1150 && code <= 1201) ||
        (code >= 1240 && code <= 1246)) return 'rain';
    
    // Thunderstorm conditions
    if (code === 1087 || 
        (code >= 1273 && code <= 1282)) return 'thunder';
    
    // Snow, ice, sleet conditions
    if ((code >= 1066 && code <= 1069) ||
        (code >= 1114 && code <= 1117) ||
        (code >= 1204 && code <= 1237) || 
        (code >= 1249 && code <= 1264)) return 'snow';
    
    // Default
    return 'unknown';
  }, []);
  
  // Track weather transitions for smoother animation
  const weatherType = useMemo(() => getWeatherType(weatherCode), [weatherCode, getWeatherType]);
  const prevWeatherType = useMemo(() => prevWeatherCode ? getWeatherType(prevWeatherCode) : null, [prevWeatherCode, getWeatherType]);
  
  // Determine if sun/moon should be visible based on weather condition
  const shouldShowCelestialBodies = useMemo(() => {
    // Show sun/moon for clear sky and partly cloudy
    return weatherCode === 1000 || weatherCode === 1003;
  }, [weatherCode]);

  // Determine if we need a dual transition for visual effect
  const shouldShowDualTransition = useMemo(() => {
    if (!prevWeatherType || prevWeatherType === weatherType) return false;
    
    const significantChange = (
      // Transitions that benefit from dual animation
      (prevWeatherType === 'clear' && weatherType === 'rain') ||
      (prevWeatherType === 'clear' && weatherType === 'snow') ||
      (prevWeatherType === 'clear' && weatherType === 'thunder') ||
      (prevWeatherType === 'cloudy' && weatherType === 'rain') ||
      (prevWeatherType === 'cloudy' && weatherType === 'snow') ||
      (prevWeatherType === 'rain' && weatherType === 'snow') ||
      (prevWeatherType === 'rain' && weatherType === 'thunder')
    );
    
    return significantChange;
  }, [prevWeatherType, weatherType]);
  
  // Optimize animation for fog/mist on low-end devices by reducing transition duration
  const getTransitionDuration = useMemo(() => {
    // Use shorter animations for fog/mist to reduce performance impact
    if ([1030, 1135, 1147].includes(weatherCode)) {
      return shouldShowDualTransition ? 1 : 0.5;
    }
    return shouldShowDualTransition ? 1.5 : 1;
  }, [weatherCode, shouldShowDualTransition]);

  // Render weather-specific elements with memoization to avoid unnecessary recalculations
  const renderWeatherElements = useMemo(() => {
    if (!weatherData) return null;
    
    // Clear sky
    if (weatherCode === 1000) {
      return <ClearSky isDay={isDay} sunPosition={sunPosition} moonPosition={moonPosition} />;
    }
    
    // Clouds (partly cloudy, cloudy, overcast)
    if (weatherCode >= 1003 && weatherCode <= 1009) {
      return <CloudsComponent 
        cloudComponents={cloudComponents} 
        isDay={isDay} 
        sunPosition={sunPosition} 
        moonPosition={moonPosition} 
        weatherCode={weatherCode}
      />;
    }
    
    // Mist, fog, freezing fog - optimize for low-end devices
    if (weatherCode === 1030 || weatherCode === 1135 || weatherCode === 1147) {
      return <FogComponent 
        weatherCode={weatherCode} 
        isDay={isDay} 
      />;
    }
    
    // Rain (all rain types including drizzle, freezing rain, and rain showers)
    if ((weatherCode >= 1063 && weatherCode <= 1072) || 
        (weatherCode >= 1150 && weatherCode <= 1201) ||
        (weatherCode >= 1240 && weatherCode <= 1246)) {
      return <RainComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Thunderstorm (all thunder conditions)
    if (weatherCode === 1087 || 
        (weatherCode >= 1273 && weatherCode <= 1282)) {
      return <ThunderstormComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Snow (all snow types, ice pellets, sleet)
    if ((weatherCode >= 1066 && weatherCode <= 1069) ||
        (weatherCode >= 1114 && weatherCode <= 1117) ||
        (weatherCode >= 1204 && weatherCode <= 1237) || 
        (weatherCode >= 1249 && weatherCode <= 1264)) {
      return <SnowComponent 
        cloudComponents={cloudComponents} 
        weatherCode={weatherCode} 
        isMobile={isMobile} 
      />;
    }
    
    // Default for any other conditions
    return <FogComponent weatherCode={weatherCode} isDay={isDay} />;
  }, [weatherCode, isDay, isMobile, cloudComponents, sunPosition, moonPosition, weatherData]);
  
  return (
    <BackgroundContainer style={{ background: backgroundGradient }}>
      <GradientOverlay
        style={{ background: overlayGradient }}
      />
      
      {/* Add sun/moon for weather types that don't handle them internally */}
      {!shouldShowCelestialBodies && (
        <>
          {isDay && sunPosition > 0 && (
            <Sun 
              animate={{ left: '90%', top: '50%' }}
              transition={{ duration: 1 }}
              style={{ opacity: 0.5, zIndex: 0 }}
            />
          )}
          {!isDay && moonPosition > 0 && (
            <Moon 
              animate={{ left: '90%', top: '50%' }}
              transition={{ duration: 1 }}
              style={{ opacity: 0.4, zIndex: 0 }}
            />
          )}
        </>
      )}
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`weather-${weatherType}-${isDay ? 'day' : 'night'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: getTransitionDuration,
            ease: "linear" // Changed from default to linear for better performance
          }}
        >
          {renderWeatherElements}
        </motion.div>
      </AnimatePresence>
    </BackgroundContainer>
  );
};

export default React.memo(WeatherBackground); // Wrapped in memo to avoid unnecessary re-renders 