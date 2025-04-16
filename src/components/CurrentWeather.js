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
                <motion.div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2px',
                    position: 'relative',
                    paddingTop: '10px',
                    paddingBottom: '5px'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* North indicator */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#ff5555',
                      textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                    }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.8,
                      duration: 0.3
                    }}
                  >
                    N
                  </motion.div>
                  <motion.div
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      padding: '5px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      background: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' 
                    }}
                    animate={{
                      boxShadow: [
                        '0 2px 8px rgba(0, 0, 0, 0.15)',
                        '0 4px 12px rgba(100, 180, 255, 0.4)',
                        '0 2px 8px rgba(0, 0, 0, 0.15)'
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2
                      }
                    }}
                    aria-label={`Wind direction: ${weatherData.current.wind_degree} degrees`}
                  >
                    <motion.svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: weatherData.current.wind_degree }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 60, 
                        damping: 20,
                        duration: 1 
                      }}
                    >
                      <motion.path 
                        d="M12 3L12 21M12 3L7 9M12 3L17 9" 
                        stroke="rgba(255, 255, 255, 0.9)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: 1,
                          filter: [
                            "drop-shadow(0 0 1px rgba(255, 255, 255, 0.2))",
                            "drop-shadow(0 0 3px rgba(100, 180, 255, 0.6))",
                            "drop-shadow(0 0 1px rgba(255, 255, 255, 0.2))"
                          ]
                        }}
                        transition={{ 
                          pathLength: { duration: 0.8, delay: 0.2 }, 
                          opacity: { duration: 0.4, delay: 0.2 },
                          filter: {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2
                          }
                        }}
                      />
                      <motion.circle
                        cx="12"
                        cy="12"
                        r="1.5"
                        fill="rgba(255, 255, 255, 0.9)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          fill: [
                            "rgba(255, 255, 255, 0.9)",
                            "rgba(100, 180, 255, 0.9)",
                            "rgba(255, 255, 255, 0.9)"
                          ]
                        }}
                        transition={{ 
                          scale: { duration: 0.5, delay: 0.6 },
                          opacity: { duration: 0.5, delay: 0.6 },
                          fill: {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2
                          }
                        }}
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </dd>
            </Detail>
          </motion.div>
        </WeatherDetails>
      </WeatherInfo>
    </StyledCurrentWeather>
  );
};

export default CurrentWeather; 