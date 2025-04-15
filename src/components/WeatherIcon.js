import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  WiDaySunny, 
  WiNightClear,
  WiDayCloudy, 
  WiNightAltCloudy,
  WiCloud, 
  WiCloudy,
  WiRain,
  WiDayRain,
  WiNightRain,
  WiDayThunderstorm,
  WiNightThunderstorm,
  WiDaySnow,
  WiNightSnow,
  WiFog,
  WiSleet,
  WiHail} from 'react-icons/wi';

const WeatherIcon = ({ code, isDay, size = 'large' }) => {

  const getIcon = () => {
    // Clear
    if (code === 1000) {
      return isDay ? <WiDaySunny /> : <WiNightClear />;
    }
    
    // Partly cloudy
    if (code === 1003) {
      return isDay ? <WiDayCloudy /> : <WiNightAltCloudy />;
    }
    
    // Cloudy
    if (code >= 1006 && code <= 1030) {
      return code < 1009 ? <WiCloud /> : <WiCloudy />;
    }
    
    // Thunderstorm (with or without rain/snow)
    if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
      return isDay ? <WiDayThunderstorm /> : <WiNightThunderstorm />;
    }
    
    // Rain (without thunder)
    if ((code >= 1063 && code <= 1072) || 
        (code >= 1150 && code <= 1201) || 
        (code >= 1240 && code <= 1246)) {
      if (code >= 1180 && code <= 1195) {
        return isDay ? <WiDayRain /> : <WiNightRain />;
      }
      return <WiRain />;
    }
    
    // Snow (without thunder)
    if ((code >= 1210 && code <= 1237) || 
        (code >= 1249 && code <= 1264)) {
      return isDay ? <WiDaySnow /> : <WiNightSnow />;
    }
    
    // Sleet or mixed precipitation
    if (code >= 1237 && code <= 1252) {
      return <WiSleet />;
    }
    
    // Hail
    if (code >= 1252 && code <= 1264) {
      return <WiHail />;
    }
    
    // Fog or other conditions
    return <WiFog />;
  };

  // Animation variants with more diversity
  const sunnyVariants = {
    animate: {
      rotate: 360,
      scale: [1, 1.05, 1],
      transition: {
        rotate: {
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  };

  const rainVariants = {
    animate: {
      y: [0, 5, 0],
      scale: [1, 0.98, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const thunderVariants = {
    animate: {
      scale: [1, 1.1, 1],
      filter: [
        "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))", 
        "drop-shadow(0 0 16px rgba(120, 180, 255, 0.8))", 
        "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
      ],
      transition: {
        scale: {
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: "easeOut"
        },
        filter: {
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: "easeOut"
        }
      }
    }
  };

  const fogVariants = {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      x: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cloudVariants = {
    animate: {
      x: [0, 5, 0],
      y: [0, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const snowVariants = {
    animate: {
      y: [0, 3, 0],
      rotate: [0, 5, 0, -5, 0],
      filter: ["drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))", "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))", "drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const nightVariants = {
    animate: {
      scale: [1, 1.05, 1],
      filter: ["drop-shadow(0 0 8px rgba(200, 220, 255, 0.5))", "drop-shadow(0 0 12px rgba(200, 220, 255, 0.7))", "drop-shadow(0 0 8px rgba(200, 220, 255, 0.5))"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getVariants = () => {
    // Clear sky
    if (code === 1000) return isDay ? sunnyVariants : nightVariants;
    
    // Partly cloudy
    if (code >= 1003 && code <= 1030) return cloudVariants;
    
    // Thunderstorm with rain
    if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
      return thunderVariants;
    }
    
    // Rain without thunder
    if ((code >= 1063 && code <= 1072) || 
        (code >= 1150 && code <= 1201) || 
        (code >= 1240 && code <= 1246)) {
      return rainVariants;
    }
    
    // Fog
    if ((code >= 1030 && code <= 1035) || (code >= 1135 && code <= 1147)) return fogVariants;
    
    // Snow without thunder
    if ((code >= 1210 && code <= 1237) || 
        (code >= 1249 && code <= 1264)) {
      return snowVariants;
    }
    
    return {};
  };

  // Get glow effect based on weather condition
  const getGlowEffect = () => {
    // Clear
    if (code === 1000) {
      return isDay 
        ? '0 0 20px rgba(255, 200, 0, 0.8)' 
        : '0 0 20px rgba(180, 200, 255, 0.6)';
    }
    
    // Thunder with rain/snow
    if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
      return '0 0 20px rgba(100, 150, 255, 0.8)';
    }
    
    // Snow
    if ((code >= 1210 && code <= 1237) || (code >= 1249 && code <= 1264)) {
      return '0 0 20px rgba(200, 220, 255, 0.6)';
    }
    
    // Rain
    if ((code >= 1063 && code <= 1072) || 
        (code >= 1150 && code <= 1201) || 
        (code >= 1240 && code <= 1246)) {
      return '0 0 15px rgba(100, 170, 255, 0.6)';
    }
    
    return '0 0 10px rgba(255, 255, 255, 0.3)';
  };

  return (
    <IconWrapper size={size} weatherCode={code} isDay={isDay}>
      <AnimatedIcon
        variants={getVariants()}
        animate="animate"
        style={{ textShadow: getGlowEffect() }}
      >
        {getIcon()}
      </AnimatedIcon>
    </IconWrapper>
  );
};

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => {
    switch (props.size) {
      case 'xsmall':
        return '1.5rem';
      case 'small':
        return '2rem';
      case 'medium':
        return '3.5rem';
      case 'large':
      default:
        return '5rem';
    }
  }};
  color: ${props => {
    // Adjust colors based on weather and time of day
    if (props.weatherCode === 1000) return props.isDay ? '#FFF700' : '#E8F0FF';
    
    // Thunder
    if ((props.weatherCode >= 1087 && props.weatherCode <= 1117) || 
        (props.weatherCode >= 1273 && props.weatherCode <= 1282)) {
      return '#BBDEFB';
    }
    
    // Snow
    if ((props.weatherCode >= 1210 && props.weatherCode <= 1237) || 
        (props.weatherCode >= 1249 && props.weatherCode <= 1264)) {
      return '#E1F5FE';
    }
    
    // Rain
    if ((props.weatherCode >= 1063 && props.weatherCode <= 1072) || 
        (props.weatherCode >= 1150 && props.weatherCode <= 1201) || 
        (props.weatherCode >= 1240 && props.weatherCode <= 1246)) {
      return '#B3E5FC';
    }
    
    return '#fff';
  }};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle, 
      ${props => {
        if (props.weatherCode === 1000) {
          return props.isDay ? 'rgba(255,255,0,0.2)' : 'rgba(200,220,255,0.15)';
        }
        if ((props.weatherCode >= 1087 && props.weatherCode <= 1117) || 
            (props.weatherCode >= 1273 && props.weatherCode <= 1282)) {
          return 'rgba(180,200,255,0.2)';
        }
        if ((props.weatherCode >= 1210 && props.weatherCode <= 1237) || 
            (props.weatherCode >= 1249 && props.weatherCode <= 1264)) {
          return 'rgba(240,250,255,0.15)';
        }
        return 'rgba(255,255,255,0.1)';
      }} 0%, 
      rgba(255,255,255,0) 70%
    );
    border-radius: 50%;
    z-index: -1;
  }
`;

const AnimatedIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  svg {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  }
`;

export default WeatherIcon; 