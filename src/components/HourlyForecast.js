import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { WiRaindrop, WiStrongWind } from 'react-icons/wi';
import WeatherIcon from './WeatherIcon';
import { FONT_SIZE } from '../styles/TypographyStyles';

const HourlyForecast = ({ weatherData, unit, getTemperature, isDay, currentTime }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [hoveredHour, setHoveredHour] = useState(null);
  
  // Guard clause to prevent errors when weatherData or forecast data is not available
  if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
    return null;
  }
  
  const forecastday = weatherData.forecast.forecastday;
  
  // Ensure selectedDay is within bounds
  if (selectedDay >= forecastday.length) {
    setSelectedDay(0);
  }
  
  // Get current hour to highlight the current time in today's forecast based on location's time
  const currentHour = currentTime ? currentTime.getHours() : new Date().getHours();

  // Handle day navigation
  const nextDay = () => {
    if (selectedDay < forecastday.length - 1) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const prevDay = () => {
    if (selectedDay > 0) {
      setSelectedDay(selectedDay - 1);
    }
  };
  
  // Function to safely get the selected day's data
  const getSelectedDayData = () => {
    return forecastday[selectedDay] || forecastday[0];
  };
  
  // Function to determine if weather is severe
  const isSevereWeather = (code) => {
    // Thunderstorms, heavy rain, snow, etc.
    return (code >= 1087 && code <= 1117) || // Thunder
           (code >= 1273 && code <= 1282) || // Thunderstorm with rain or snow
           (code >= 1186 && code <= 1201) || // Heavy rain
           (code >= 1246 && code <= 1264);   // Heavy snow/sleet
  };
  
  // Function to check if weather has thunder
  const hasThunder = (code) => {
    return (code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282);
  };
  
  // Function to get weather-specific animations
  const getWeatherAnimation = (hourData) => {
    const code = hourData.condition.code;
    
    // Thunderstorms and thunderstorm with rain/snow
    if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
      return {
        container: {
          boxShadow: [
            "0 4px 12px rgba(0, 0, 0, 0.1)", 
            "0 8px 24px rgba(100, 150, 255, 0.4)", 
            "0 4px 12px rgba(0, 0, 0, 0.1)"
          ],
          transition: {
            boxShadow: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }
          }
        },
        icon: {
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, -5, 0],
          filter: [
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))", 
            "drop-shadow(0 0 15px rgba(120, 170, 255, 0.8))",
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"
          ],
          transition: {
            scale: {
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3
            },
            rotate: {
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3
            },
            filter: {
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeOut"
            }
          }
        }
      };
    }
    
    // Heavy rain
    if ((code >= 1186 && code <= 1201) || (code >= 1243 && code <= 1246)) {
      return {
        container: {
          y: [0, 1, 0],
          transition: {
            y: {
              duration: 1,
              repeat: Infinity,
              repeatType: "mirror"
            }
          }
        },
        icon: {
          y: [0, -3, 0],
          filter: [
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))", 
            "drop-shadow(0 0 8px rgba(100, 150, 255, 0.7))",
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"
          ],
          transition: {
            duration: 2,
            repeat: Infinity
          }
        }
      };
    }
    
    // Snow - making sure to exclude thunderstorm with snow
    if ((code >= 1210 && code <= 1237) || 
        (code >= 1249 && code <= 1264)) {
      return {
        container: {
          y: [0, 2, 0],
          transition: {
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }
          }
        },
        icon: {
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))", 
            "drop-shadow(0 0 10px rgba(220, 240, 255, 0.8))",
            "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"
          ],
          transition: {
            duration: 3,
            repeat: Infinity
          }
        }
      };
    }
    
    // Clear day
    if (code === 1000 && hourData.is_day === 1) {
      return {
        container: {},
        icon: {
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 5px rgba(255, 210, 0, 0.5))", 
            "drop-shadow(0 0 10px rgba(255, 210, 0, 0.8))",
            "drop-shadow(0 0 5px rgba(255, 210, 0, 0.5))"
          ],
          transition: {
            duration: 4,
            repeat: Infinity
          }
        }
      };
    }
    
    // Clear night
    if (code === 1000 && hourData.is_day === 0) {
      return {
        container: {},
        icon: {
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 5px rgba(200, 220, 255, 0.5))", 
            "drop-shadow(0 0 8px rgba(200, 220, 255, 0.7))",
            "drop-shadow(0 0 5px rgba(200, 220, 255, 0.5))"
          ],
          transition: {
            duration: 5,
            repeat: Infinity
          }
        }
      };
    }
    
    // Default subtle animation
    return {
      container: {},
      icon: {
        scale: [1, 1.03, 1],
        transition: {
          duration: 3,
          repeat: Infinity
        }
      }
    };
  };

  return (
    <HourlyForecastContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ForecastHeader>
        <h3>Hourly Forecast</h3>
        <DaySelector>
          <NavButton 
            onClick={prevDay} 
            disabled={selectedDay === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronLeft />
          </NavButton>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DayDisplay>
                {new Date(getSelectedDayData().date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </DayDisplay>
            </motion.div>
          </AnimatePresence>
          <NavButton 
            onClick={nextDay} 
            disabled={selectedDay === forecastday.length - 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronRight />
          </NavButton>
        </DaySelector>
      </ForecastHeader>
      
      <HourlyList className="hide-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', gap: '12px', paddingLeft: '5px', paddingRight: '5px' }}
          >
            {getSelectedDayData().hour
              // Filter to show only future hours for today, or all hours for future days
              .filter(hourData => selectedDay > 0 || new Date(hourData.time).getHours() >= currentHour)
              .map((hourData, index) => {
                const hourTime = new Date(hourData.time);
                const isNow = selectedDay === 0 && hourTime.getHours() === currentHour;
                const weatherAnimation = getWeatherAnimation(hourData);
                const isSevere = isSevereWeather(hourData.condition.code);
                const isThunder = hasThunder(hourData.condition.code);
                
                return (
                  <HourlyItem 
                    key={hourData.time}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      ...weatherAnimation.container
                    }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    isNow={isNow}
                    isSevere={isSevere}
                    isThunder={isThunder}
                    hourData={hourData}
                    whileHover={{ 
                      y: -5,
                      scale: 1.03,
                      boxShadow: isThunder ? 
                        '0 8px 24px rgba(100, 150, 255, 0.5)' : 
                        (isSevere ? '0 8px 24px rgba(255, 100, 100, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.4)'),
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    onMouseEnter={() => setHoveredHour(index)}
                    onMouseLeave={() => setHoveredHour(null)}
                  >
                    <HourTime isNow={isNow}>
                      {isNow ? 'Now' : hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                    </HourTime>
                    
                    <motion.div
                      animate={
                        hoveredHour === index 
                          ? weatherAnimation.icon 
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <HourIcon isThunder={isThunder}>
                        <WeatherIcon 
                          code={hourData.condition.code} 
                          isDay={hourData.is_day === 1} 
                          size="small"
                        />
                      </HourIcon>
                    </motion.div>
                    
                    <HourTemp>
                      <motion.span
                        key={`${hourData.temp_c}-${unit}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getTemperature(hourData.temp_c, hourData.temp_f)}°{unit}
                      </motion.span>
                    </HourTemp>
                    
                    <ConditionText 
                      title={hourData.condition.text} 
                      isSevere={isSevere}
                      isThunder={isThunder}
                    >
                      {hourData.condition.text}
                    </ConditionText>
                    
                    <HourDetail>
                      <DetailRow>
                        <RainInfo hasRain={hourData.chance_of_rain > 10}>
                          <WiRaindrop />
                          <span>{hourData.chance_of_rain}%</span>
                        </RainInfo>
                      </DetailRow>
                      <DetailRow>
                        <WindInfo isWindy={hourData.wind_kph > 20}>
                          <WiStrongWind />
                          <div>
                            <span>{unit === 'C' ? hourData.wind_kph + ' km/h' : hourData.wind_mph + ' mph'}</span>
                          </div>
                        </WindInfo>
                      </DetailRow>
                    </HourDetail>
                  </HourlyItem>
                );
              })}
          </motion.div>
        </AnimatePresence>
      </HourlyList>
    </HourlyForecastContainer>
  );
};

const HourlyForecastContainer = styled(motion.div)`
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ForecastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
  
  h3 {
    color: #fff;
    margin: 0;
    font-size: 1.3rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const DaySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DayDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 8px 16px;
  color: #fff;
  font-size: 0.9rem;
  min-width: 150px;
  text-align: center;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const NavButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HourlyList = styled.div`
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  margin: 0 -5px;
  padding: 10px 5px 20px 5px;
  
  /* Apply our custom scrollbar class for hover effect */
  &.hide-scrollbar {
    &::-webkit-scrollbar {
      height: 0;
    }
  }
  
  &::-webkit-scrollbar-track {
    margin: 0 5px;
  }
`;

const HourlyItem = styled(motion.div)`
  background: ${props => {
    if (props.isSevere) {
      // Different background for thunderstorm vs other severe weather
      const code = props.hourData?.condition?.code;
      if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
        return 'rgba(20, 20, 35, 0.4)'; // Darker for thunderstorms
      }
      return 'rgba(20, 20, 30, 0.35)'; // Dark for other severe weather
    }
    return props.isNow ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.3)';
  }};
  border-radius: 15px;
  padding: 16px 12px;
  min-width: 130px;
  width: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${props => {
    if (props.isSevere) {
      const code = props.hourData?.condition?.code;
      if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
        return '0 8px 32px rgba(50, 50, 120, 0.4)'; // Blue-tinted shadow for thunderstorms
      }
      return '0 8px 32px rgba(30, 30, 50, 0.35)'; 
    }
    return props.isNow ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)';
  }};
  border: 1px solid rgba(255, 255, 255, ${props => {
    if (props.isSevere) {
      const code = props.hourData?.condition?.code;
      if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
        return '0.35'; // More pronounced border for thunderstorms
      }
      return '0.3';
    }
    return props.isNow ? '0.25' : '0.1';
  }});
  backdrop-filter: blur(2px);
  position: relative;
  overflow: hidden;
  margin: 5px;
  transform-origin: center center;
  transition: all 0.2s ease-out;
  
  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.isSevere) {
        const code = props.hourData?.condition?.code;
        if ((code >= 1087 && code <= 1117) || (code >= 1273 && code <= 1282)) {
          return 'linear-gradient(to right, rgba(100,150,255,0.7), rgba(150,200,255,0.9), rgba(100,150,255,0.7))'; // Blue for thunderstorms
        }
        return 'linear-gradient(to right, rgba(255,100,100,0.7), rgba(255,200,100,0.9), rgba(255,100,100,0.7))';
      }
      return 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5))';
    }};
    opacity: ${props => props.isNow || props.isSevere ? 1 : 0};
  }
`;

const HourTime = styled.div`
  font-size: 0.9rem;
  color: #FFFFFF;
  margin-bottom: 8px;
  font-weight: ${props => props.isNow ? '600' : '500'};
  height: 20px;
  display: flex;
  align-items: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const HourIcon = styled.div`
  margin: 4px 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  ${props => props.isThunder && `
    animation: thunderPulse 4s infinite;
    
    @keyframes thunderPulse {
      0%, 80%, 100% {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      85%, 90%, 95% {
        filter: drop-shadow(0 0 10px rgba(150, 200, 255, 0.8));
      }
    }
  `}
`;

const HourTemp = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 4px 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConditionText = styled.div`
  font-size: 0.75rem;
  color: #FFFFFF;
  text-align: center;
  min-height: 32px;
  max-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  line-height: 1.2;
  width: 100%;
  overflow-wrap: break-word;
  font-size: ${FONT_SIZE.sm};
  word-wrap: break-word;
  hyphens: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: ${props => {
    if (props.isThunder) return '700';
    if (props.isSevere) return '600';
    return '500';
  }};
  text-shadow: ${props => {
    if (props.isThunder) return '0 1px 5px rgba(100, 150, 255, 0.6)';
    if (props.isSevere) return '0 1px 4px rgba(255, 100, 100, 0.5)';
    return '0 1px 3px rgba(0, 0, 0, 0.4)';
  }};
  ${props => props.isThunder && `
    color: #E3F2FD;
  `}
`;

const HourDetail = styled.div`
  width: 100%;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const RainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  color: #FFFFFF;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  background: ${props => props.hasRain ? 'rgba(0, 120, 255, 0.2)' : 'transparent'};
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  
  svg {
    font-size: 1.1rem;
    color: ${props => props.hasRain ? '#80CFFF' : 'rgba(255, 255, 255, 0.7)'};
    flex-shrink: 0;
    margin-right: 2px;
  }
  
  span {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    font-weight: ${props => props.hasRain ? '600' : '500'};
    font-size: 0.75rem;
  }
`;

const WindInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8rem;
  color: #FFFFFF;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  background: ${props => props.isWindy ? 'rgba(100, 200, 150, 0.2)' : 'transparent'};
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  
  svg {
    font-size: 1.1rem;
    color: ${props => props.isWindy ? '#A0E8D2' : 'rgba(255, 255, 255, 0.7)'};
    flex-shrink: 0;
    margin-right: 2px;
  }
  
  div {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
  }
  
  span {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    font-weight: ${props => props.isWindy ? '600' : '500'};
    font-size: 0.75rem;
  }
  
  small {
    font-size: 0.6rem;
    opacity: 0.8;
    font-weight: 400;
    margin-left: 1px;
  }
`;

export default HourlyForecast; 