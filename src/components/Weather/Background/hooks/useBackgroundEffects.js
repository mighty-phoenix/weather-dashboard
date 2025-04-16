import { useEffect, useState, useMemo } from 'react';
import chroma from 'chroma-js';

const useBackgroundEffects = (weatherData, isDay, weatherCode, isMobile) => {
  const [sunPosition, setSunPosition] = useState(0);
  const [moonPosition, setMoonPosition] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#4facfe', '#00f2fe']);
  const [gradientDirection, setGradientDirection] = useState(135);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)');
  const [overlayGradient, setOverlayGradient] = useState('');
  
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
        if (now.getMinutes() === 0) {
          const timeRatio = (hours % 24) / 24;
          const newDirection = Math.floor(timeRatio * 360);
          setGradientDirection(newDirection);
        }
      }
    } catch (error) {
      console.error("Error parsing sun/moon positions:", error);
    }
  }, [weatherData]);
  
  // Create overlay gradient based on time and colors
  useEffect(() => {
    const now = new Date();
    const randomX = Math.floor(((now.getHours() * 60 + now.getMinutes()) % 100));
    const randomY = Math.floor(((now.getHours() * 60 + now.getMinutes()) % 100));
    
    const gradient = `radial-gradient(circle at ${randomX}% ${randomY}%, 
      ${chroma(gradientColors[0]).alpha(0.2).css()} 0%, 
      ${chroma(gradientColors[1]).alpha(0.4).css()} 50%, 
      ${chroma(gradientColors[0]).alpha(0.3).css()} 100%)`;
    
    setOverlayGradient(gradient);
  }, [gradientColors]);
  
  // Calculate background gradient based on weather and time of day
  useEffect(() => {
    let newColors = [];
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
  }, [weatherCode, isDay, sunPosition, moonPosition, gradientDirection]);
  
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
      
      return {
        key: `cloud-${i}-${weatherCode}`,
        delay: i * 1.5 + seedRandom(i) * 2,
        size: size,
        dark: weatherCode >= 1063,
        style: { 
          top: `${top}%`,
          left: `${left}%`,
          zIndex: 1 + Math.floor(seedRandom(i + 12) * 3)
        }
      };
    });
  }, [weatherCode, isDay, isMobile, weatherData]);

  return {
    backgroundGradient,
    overlayGradient,
    sunPosition,
    moonPosition,
    gradientColors,
    gradientDirection,
    cloudComponents
  };
};

export default useBackgroundEffects; 