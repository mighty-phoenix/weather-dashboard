// Format the local time in a readable way
export const formatLocalTime = (localtimeStr) => {
  if (!localtimeStr) return '';
  try {
    const date = new Date(localtimeStr);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting localtime:', error, localtimeStr);
    return localtimeStr; // Return the original string if parsing fails
  }
};

// Get AQI category based on index
export const getAQICategory = (index) => {
  if (index <= 1) return 'Good';
  if (index <= 2) return 'Moderate';
  if (index <= 3) return 'Unhealthy for Sensitive Groups';
  if (index <= 4) return 'Unhealthy';
  if (index <= 5) return 'Very Unhealthy';
  return 'Hazardous';
};

// Get AQI range based on index
export const getAQIRange = (index) => {
  if (index <= 1) return '0-50';
  if (index <= 2) return '51-100';
  if (index <= 3) return '101-150';
  if (index <= 4) return '151-200';
  if (index <= 5) return '201-300';
  return '301+';
};

// Get pollutant level classification (0-3 where 0 is good, 3 is bad)
export const getPollutantLevel = (value, pollutant) => {
  if (!value) return 0;
  
  // Thresholds based on US EPA standards
  const thresholds = {
    pm2_5: [12, 35.4, 55.4], // Good, Moderate, Unhealthy for Sensitive Groups thresholds
    pm10: [54, 154, 254],
    o3: [54, 70, 85],
    no2: [53, 100, 360],
    so2: [35, 75, 185],
    co: [4.4, 9.4, 12.4]
  };
  
  const levels = thresholds[pollutant] || [50, 100, 150];
  
  if (value <= levels[0]) return 0; // Good
  if (value <= levels[1]) return 1; // Moderate
  if (value <= levels[2]) return 2; // Unhealthy for Sensitive Groups
  return 3; // Unhealthy or worse
};

// Get emoji based on pollutant level
export const getPollutantEmoji = (level) => {
  switch(level) {
    case 0: return '🤩'; // Good
    case 1: return '😊'; // Moderate
    case 2: return '😐'; // Unhealthy for Sensitive Groups
    case 3: return '😣'; // Unhealthy or worse
    default: return '🤔';
  }
};

// Get pollutant information
export const getPollutantInfo = (pollutant) => {
  switch(pollutant) {
    case 'pm2_5':
      return "PM2.5 are fine particles less than 2.5 micrometers in diameter. They can penetrate deep into lungs and bloodstream, causing respiratory and cardiovascular issues.";
    case 'pm10':
      return "PM10 are inhalable particles with diameters 10 micrometers and smaller. They can enter the lungs and cause respiratory problems.";
    case 'o3':
      return "Ozone (O₃) at ground level is a harmful air pollutant. It can trigger asthma attacks, irritate the respiratory system, and reduce lung function.";
    case 'no2':
      return "Nitrogen Dioxide (NO₂) comes from burning fuel. It can irritate airways and worsen respiratory conditions like asthma.";
    case 'so2':
      return "Sulfur Dioxide (SO₂) is produced by burning fossil fuels. It can harm the respiratory system and aggravate existing heart and lung diseases.";
    case 'co':
      return "Carbon Monoxide (CO) is a colorless, odorless gas. It reduces oxygen delivery to organs and can cause headaches, dizziness, and at high levels, death.";
    default:
      return "Air pollutant affecting health and environment.";
  }
};

// Get weather background based on condition and time
export const getWeatherBackground = (weatherData, isDay) => {
  if (!weatherData) return 'linear-gradient(135deg, #6e8efb, #a777e3)';
  
  const condition = weatherData.current.condition.code;
  
  // Clear
  if ([1000].includes(condition)) {
    return isDay 
      ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
      : 'linear-gradient(135deg, #0c1445 0%, #203a8f 100%)';
  }
  // Partly cloudy
  else if ([1003, 1006].includes(condition)) {
    return isDay 
      ? 'linear-gradient(135deg, #5583EE 0%, #41D8DD 100%)' 
      : 'linear-gradient(135deg, #12132e 0%, #2b4a8f 100%)';
  }
  // Cloudy
  else if ([1009, 1030, 1135, 1147].includes(condition)) {
    return isDay 
      ? 'linear-gradient(135deg, #6a85b6 0%, #bac8e0 100%)' 
      : 'linear-gradient(135deg, #25273c 0%, #333b5f 100%)';
  }
  // Rain
  else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(condition)) {
    return isDay 
      ? 'linear-gradient(135deg, #1c92d2 0%, #7ac4e6 100%)' 
      : 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
  }
  // Snow
  else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(condition)) {
    return isDay 
      ? 'linear-gradient(135deg, #E6DADA 0%, #8CA6DB 100%)' 
      : 'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)';
  }
  // Default
  return 'linear-gradient(135deg, #6e8efb, #a777e3)';
};

// Determine if the background is dark to adjust text color
export const isDarkBackground = (weatherData, isDay) => {
  if (!weatherData) return false;
  
  const condition = weatherData.current.condition.code;
  
  // Definitely dark backgrounds
  if (!isDay) return true;
  
  // Dark rain/storm conditions even during daytime
  if ([1087, 1273, 1276, 1279, 1282].includes(condition)) return true;
  
  // Heavy rain conditions
  if ([1192, 1195, 1201, 1243, 1246, 1252].includes(condition)) return true;
  
  return false;
};

// Get text color based on background darkness
export const getTextColor = (weatherData, isDay) => {
  if (isDarkBackground(weatherData, isDay)) {
    return {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.95)',
      tertiary: 'rgba(255, 255, 255, 0.85)',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
    };
  } else {
    return {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.95)',
      tertiary: 'rgba(255, 255, 255, 0.9)',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
    };
  }
}; 