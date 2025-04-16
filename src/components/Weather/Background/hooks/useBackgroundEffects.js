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
    
    const getWeatherGradient = () => {
      // Clear sky (1000)
      if (weatherCode === 1000) {
        if (isDay) {
          const sunProgress = sunPosition / 100;
          const color1 = chroma.mix('#4facfe', '#ff9a9e', sunProgress * 0.5, 'lab');
          const color2 = chroma.mix('#00f2fe', '#fad0c4', sunProgress * 0.5, 'lab');
          return [color1.hex(), color2.hex()];
        } else {
          const moonProgress = moonPosition / 100;
          const color1 = chroma.mix('#0c1445', '#30cfd0', moonProgress * 0.3, 'lab');
          const color2 = chroma.mix('#203a8f', '#330867', moonProgress * 0.3, 'lab');
          return [color1.hex(), color2.hex()];
        }
      }
      
      // Partly cloudy (1003)
      else if (weatherCode === 1003) {
        if (isDay) {
          return ['#5583EE', '#41D8DD'];
        } else {
          return ['#12132e', '#2b4a8f'];
        }
      }
      
      // Cloudy (1006-1009)
      else if (weatherCode >= 1006 && weatherCode <= 1009) {
        if (isDay) {
          return ['#6a85b6', '#bac8e0'];
        } else {
          return ['#25273c', '#333b5f'];
        }
      }
      
      // Mist, Fog (1030, 1135, 1147)
      else if (weatherCode === 1030 || weatherCode === 1135 || weatherCode === 1147) {
        if (isDay) {
          return ['#b8c6db', '#f5f7fa'];
        } else {
          return ['#2c3e50', '#4ca1af'];
        }
      }
      
      // Light rain, Drizzle (1063, 1150-1153, 1180-1183, 1240)
      else if (weatherCode === 1063 || 
               (weatherCode >= 1150 && weatherCode <= 1153) || 
               (weatherCode >= 1180 && weatherCode <= 1183) ||
               weatherCode === 1240) {
        if (isDay) {
          return ['#89f7fe', '#66a6ff'];
        } else {
          return ['#141E30', '#243B55'];
        }
      }
      
      // Moderate rain (1186-1189, 1243)
      else if ((weatherCode >= 1186 && weatherCode <= 1189) || weatherCode === 1243) {
        if (isDay) {
          return ['#5271C4', '#B19FFF'];
        } else {
          return ['#0F2027', '#203A43'];
        }
      }
      
      // Heavy rain (1192-1195, 1246)
      else if ((weatherCode >= 1192 && weatherCode <= 1195) || weatherCode === 1246) {
        if (isDay) {
          return ['#1c92d2', '#4d7193'];
        } else {
          return ['#0F2027', '#203A43'];
        }
      }
      
      // Freezing rain (1168-1171, 1198-1201)
      else if ((weatherCode >= 1168 && weatherCode <= 1171) || 
               (weatherCode >= 1198 && weatherCode <= 1201)) {
        if (isDay) {
          return ['#83a4d4', '#b6fbff'];
        } else {
          return ['#0B486B', '#3B8CB5'];
        }
      }
      
      // Light snow (1066, 1210-1213, 1255)
      else if (weatherCode === 1066 || 
               (weatherCode >= 1210 && weatherCode <= 1213) ||
               weatherCode === 1255) {
        if (isDay) {
          return ['#E6DADA', '#8CA6DB'];
        } else {
          return ['#2C3E50', '#4CA1AF'];
        }
      }
      
      // Moderate to heavy snow (1114, 1216-1225, 1258)
      else if (weatherCode === 1114 || 
               (weatherCode >= 1216 && weatherCode <= 1225) ||
               weatherCode === 1258) {
        if (isDay) {
          return ['#e4e5e6', '#92a3cd'];
        } else {
          return ['#2C3E50', '#203A43'];
        }
      }
      
      // Blizzard (1117)
      else if (weatherCode === 1117) {
        if (isDay) {
          return ['#C9D6FF', '#E2E2E2'];
        } else {
          return ['#243B55', '#141E30'];
        }
      }
      
      // Sleet (1069, 1204-1207, 1249-1252)
      else if (weatherCode === 1069 || 
               (weatherCode >= 1204 && weatherCode <= 1207) ||
               (weatherCode >= 1249 && weatherCode <= 1252)) {
        if (isDay) {
          return ['#83a4d4', '#9CECFB'];
        } else {
          return ['#0F2027', '#2C5364'];
        }
      }
      
      // Ice pellets (1237, 1261-1264)
      else if (weatherCode === 1237 || 
               (weatherCode >= 1261 && weatherCode <= 1264)) {
        if (isDay) {
          return ['#a1c4fd', '#c2e9fb'];
        } else {
          return ['#1A2980', '#26D0CE'];
        }
      }
      
      // Thunderstorm (1087)
      else if (weatherCode === 1087) {
        if (isDay) {
          return ['#373B44', '#4286f4'];
        } else {
          return ['#050A27', '#212D40'];
        }
      }
      
      // Thunderstorm with rain (1273-1276)
      else if (weatherCode >= 1273 && weatherCode <= 1276) {
        if (isDay) {
          return ['#4B6CB7', '#182848'];
        } else {
          return ['#000428', '#004e92'];
        }
      }
      
      // Thunderstorm with snow (1279-1282)
      else if (weatherCode >= 1279 && weatherCode <= 1282) {
        if (isDay) {
          return ['#2B32B2', '#536976'];
        } else {
          return ['#000428', '#203A43'];
        }
      }
      
      // Default case for any other weather codes
      return isDay ? ['#2193b0', '#6dd5ed'] : ['#2C3E50', '#4CA1AF'];
    };
    
    newColors = getWeatherGradient();
    gradientString = `linear-gradient(${gradientDirection}deg, ${newColors[0]} 0%, ${newColors[1]} 100%)`;
    
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
    
    // Adjust cloud count and appearance based on weather code
    let cloudCount = isMobile ? 4 : 10;
    let cloudOpacity = 0.9;
    let cloudSpeed = 1.0;
    let cloudDarkness = false;
    
    // Adjust cloud parameters based on weather code
    if (weatherCode === 1000) { // Clear sky
      cloudCount = isMobile ? 1 : 2;
      cloudOpacity = 0.4;
    } else if (weatherCode === 1003) { // Partly cloudy
      cloudCount = isMobile ? 2 : 5;
      cloudOpacity = 0.6;
    } else if (weatherCode === 1006) { // Cloudy
      cloudCount = isMobile ? 3 : 12;
      cloudOpacity = 0.8;
    } else if (weatherCode === 1009) { // Overcast
      cloudCount = isMobile ? 5 : 17;
      cloudOpacity = 0.9;
      cloudDarkness = true;
      cloudSpeed = 0.7;
    } else if ([1030, 1135, 1147].includes(weatherCode)) { // Mist, fog
      cloudCount = isMobile ? 4 : 8;
      cloudOpacity = 0.6;
      cloudSpeed = 0.5;
    } else if ((weatherCode >= 1063 && weatherCode <= 1072) || // Rain
               (weatherCode >= 1150 && weatherCode <= 1201) ||
               (weatherCode >= 1240 && weatherCode <= 1246)) {
      cloudCount = isMobile ? 4 : 9;
      cloudOpacity = 0.95;
      cloudDarkness = true;
      cloudSpeed = 0.8;
      
      // Heavier rain = darker clouds
      if (weatherCode >= 1192 || weatherCode === 1246) {
        cloudOpacity = 0.98;
        cloudSpeed = 0.9;
      }
    } else if (weatherCode === 1087 || // Thunderstorm
               (weatherCode >= 1273 && weatherCode <= 1282)) {
      cloudCount = isMobile ? 5 : 10;
      cloudOpacity = 0.98;
      cloudDarkness = true;
      cloudSpeed = 1.2;
    } else if ((weatherCode >= 1066 && weatherCode <= 1069) || // Snow
               (weatherCode >= 1114 && weatherCode <= 1117) ||
               (weatherCode >= 1204 && weatherCode <= 1237) || 
               (weatherCode >= 1249 && weatherCode <= 1264)) {
      cloudCount = isMobile ? 4 : 8;
      cloudOpacity = 0.9;
      cloudDarkness = weatherCode >= 1117; // Only very dark for blizzard
      cloudSpeed = 0.6;
    }
    
    return [...Array(cloudCount)].map((_, i) => {
      // Distribute clouds more evenly across the vertical space
      const rowIndex = i % (isMobile ? 3 : 4); 
      const verticalSection = rowIndex * (isMobile ? 33 : 25);
      
      // Horizontal distribution with proper spacing
      const horizontalSection = (i % (isMobile ? 2 : 3)) * (isMobile ? 60 : 40);
      
      const top = verticalSection + seedRandom(i * 2) * 15;
      const left = horizontalSection - 20 + seedRandom(i * 2 + 1) * 25;
      const size = 0.8 + seedRandom(i) * 0.7;
      
      return {
        key: `cloud-${i}-${weatherCode}`,
        delay: i * 1.5 + seedRandom(i) * 2,
        size: size,
        dark: cloudDarkness || weatherCode >= 1063,
        opacity: cloudOpacity - (seedRandom(i) * 0.2),
        speed: cloudSpeed - (seedRandom(i) * 0.2),
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