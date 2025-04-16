import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { formatLocalTime } from '../utils/weatherUtils';
import {
  CurrentWeather as StyledCurrentWeather,
  LocationInfo,
  WeatherInfo,
  TemperatureDisplay,
  IconContainer,
  Temperature,
  WeatherCondition,
  WeatherDetails,
  Detail
} from '../styles/CurrentWeatherStyles';

const CurrentWeather = ({ 
  weatherData, 
  unit, 
  getTemperature,
  isDay
}) => {
  // Guard clause to prevent errors when weatherData is not available
  if (!weatherData || !weatherData.location || !weatherData.current) {
    return null;
  }
  
  return (
    <StyledCurrentWeather
      as="section"
      aria-label="Current Weather Information"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LocationInfo as="header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {weatherData.location.name}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {weatherData.location.country}
        </motion.h2>
        <motion.time
          dateTime={weatherData.location.localtime}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {weatherData.location.localtime ? formatLocalTime(weatherData.location.localtime) : ''}
        </motion.time>
      </LocationInfo>
      
      <WeatherInfo as="article">
        <TemperatureDisplay>
          <motion.figure
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              type: "spring",
              stiffness: 100 
            }}
          >
            <IconContainer>
              <WeatherIcon 
                code={weatherData.current.condition.code} 
                isDay={isDay}
                alt={`Weather icon for ${weatherData.current.condition.text}`}
              />
            </IconContainer>
          </motion.figure>
          <Temperature>
            <motion.span
              key={weatherData.current.temp_c}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              aria-label={`Temperature: ${getTemperature(
                weatherData.current.temp_c, 
                weatherData.current.temp_f
              )} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}`}
            >
              {getTemperature(
                weatherData.current.temp_c, 
                weatherData.current.temp_f
              )}°{unit}
            </motion.span>
          </Temperature>
        </TemperatureDisplay>
        
        <WeatherCondition>
          <span aria-label="Weather condition">{weatherData.current.condition.text}</span>
          {/* If this is thunder condition, add lightning icon */}
          {(weatherData.current.condition.code >= 1087 && weatherData.current.condition.code <= 1117) || 
           (weatherData.current.condition.code >= 1273 && weatherData.current.condition.code <= 1282) ? (
            <motion.span 
              className="thunder-indicator"
              aria-hidden="true"
              animate={{
                opacity: [1, 0.7, 1],
                scale: [1, 1.1, 1],
                filter: [
                  "drop-shadow(0 0 1px rgba(255, 255, 255, 0.5))",
                  "drop-shadow(0 0 8px rgba(180, 210, 255, 0.8))",
                  "drop-shadow(0 0 1px rgba(255, 255, 255, 0.5))"
                ]
              }}
              transition={{
                repeat: Infinity,
                repeatDelay: 3,
                duration: 0.3
              }}
            >
              
            </motion.span>
          ) : null}
        </WeatherCondition>
        
        <WeatherDetails as="dl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Detail>
              <dt>Feels Like</dt>
              <dd>
                {getTemperature(
                  weatherData.current.feelslike_c, 
                  weatherData.current.feelslike_f
                )}°{unit}
              </dd>
            </Detail>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Detail>
              <dt>Humidity</dt>
              <dd>{weatherData.current.humidity}%</dd>
            </Detail>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Detail>
              <dt>Wind</dt>
              <dd>
                {unit === 'C' 
                  ? `${weatherData.current.wind_kph} km/h` 
                  : `${weatherData.current.wind_mph} mph`}
              </dd>
            </Detail>
          </motion.div>
        </WeatherDetails>
      </WeatherInfo>
    </StyledCurrentWeather>
  );
};

export default CurrentWeather; 