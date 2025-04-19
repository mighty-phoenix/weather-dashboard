import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiX, FiInfo } from 'react-icons/fi';
import { WiHumidity, WiStrongWind, WiThermometer } from 'react-icons/wi';
import { BsSnow, BsCloudRain, BsThermometerHigh, BsThermometerLow, BsSunrise, BsSunset, BsEye, BsWater } from 'react-icons/bs';
import WeatherIcon from './WeatherIcon';
import { FaIceCream } from "react-icons/fa";
import MoonPhase from './MoonPhase';
import {
  ForecastContainer,
  ForecastList,
  ForecastItem,
  ForecastTopRow,
  ForecastDay,
  ForecastIcon,
  ForecastTemp,
  ForecastCondition,
  ExpandButton,
  UVIndicator,
  FullWidthPanel,
  ExpandedForecastGrid,
  ExpandedForecastSection,
  ExpandedForecastHeader,
  DetailGroup,
  DetailValue,
  HourlySnippet,
  HourlySnippetItem,
  AstroInfo,
  CloseButton,
  InfoIcon,
  TooltipTitle,
  TooltipContent,
  TooltipItem
} from '../styles/ForecastStyles';

// Portal tooltip component that renders directly to document body
const PortalTooltip = ({ show, content, anchorEl, onMouseEnter, onMouseLeave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);
  
  useEffect(() => {
    if (show && anchorEl.current) {
      const rect = anchorEl.current.getBoundingClientRect();
      
      // Adjust positioning for mobile
      const isMobile = window.innerWidth <= 768;
      let top, left;
      
      if (isMobile) {
        // Center tooltip under the anchor element on mobile
        top = rect.bottom + 10;
        left = window.innerWidth / 2 - 125; // Half the tooltip width (250px)
      } else {
        // Desktop positioning
        top = rect.top - 10;
        left = Math.min(rect.left - 220, window.innerWidth - 260);
      }
      
      setPosition({
        top: Math.max(top, 10),
        left: Math.max(left, 10)
      });
    }
  }, [show, anchorEl]);
  
  if (!isVisible) return null;
  
  const handleMouseEnter = () => {
    setIsVisible(true);
    if (onMouseEnter) onMouseEnter();
  };
  
  const handleMouseLeave = () => {
    if (!show) setIsVisible(false);
    if (onMouseLeave) onMouseLeave();
  };
  
  return ReactDOM.createPortal(
    <div 
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        zIndex: 9999,
        width: '250px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        fontSize: '0.75rem',
        lineHeight: 1.4,
        pointerEvents: 'auto',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        transform: 'translateY(-5px)'
      }}
      onClick={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </div>,
    document.body
  );
};

const Forecast = ({ 
  weatherData, 
  unit, 
  getTemperature, 
  expandedForecast, 
  toggleForecast,
  showTooltip,
  setShowTooltip 
}) => {
  const infoIconRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Guard clause to prevent errors when weatherData or forecast data is not available
  if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
    return null;
  }

  const handleTooltipShow = (tooltipId) => {
    setShowTooltip(tooltipId);
  };

  const handleTooltipHide = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(null);
    }, 300); // 300ms delay before hiding
  };


  const conditionsTooltipContent = (
    <>
      <TooltipTitle>Conditions Legend</TooltipTitle>
      <TooltipContent>
        <TooltipItem><WiHumidity style={{verticalAlign: 'middle'}} /> Humidity - Percentage of moisture in the air</TooltipItem>
        <TooltipItem><BsEye style={{verticalAlign: 'middle'}} /> Visibility - Maximum distance you can see clearly</TooltipItem>
        <TooltipItem><WiThermometer style={{verticalAlign: 'middle'}} /> UV Index - Strength of ultraviolet radiation (0-11+)</TooltipItem>
      </TooltipContent>
    </>
  );

  return (
    <ForecastContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3>10-Day Forecast</h3>
      <ForecastList className="hide-scrollbar">
        {weatherData.forecast.forecastday.map((day, index) => (
          <ForecastItem
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              y: -5, 
              scale: 1.03, 
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            onClick={() => toggleForecast(index)}
            expanded={expandedForecast === index}
            className={`${expandedForecast === index ? 'expanded' : ''} glass-dark`}
          >
            <ForecastTopRow>
              <ForecastDay>
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </ForecastDay>
            </ForecastTopRow>
            
            <ForecastIcon>
              <WeatherIcon 
                code={day.day.condition.code} 
                isDay={true} 
                size="small"
              />
            </ForecastIcon>
            
            <ForecastTemp>
              {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}°/
              {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}°
            </ForecastTemp>
            
            <ForecastCondition>
              {day.day.condition.text}
            </ForecastCondition>
            
            <ExpandButton
              animate={{ rotate: expandedForecast === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              parent={{ expanded: expandedForecast === index }}
            >
              <FiChevronDown />
            </ExpandButton>
          </ForecastItem>
        ))}
      </ForecastList>
      
      <AnimatePresence>
        {expandedForecast !== null && (
          <FullWidthPanel
            initial={{ 
              opacity: 0, 
              height: 0, 
              transform: 'perspective(800px) rotateX(-2deg) scale(0.98)'
            }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              transform: 'perspective(800px) rotateX(0) scale(1)',
              transition: {
                height: { duration: 0.4 },
                opacity: { duration: 0.3 },
                transform: { duration: 0.4, ease: "easeOut" }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0, 
              transform: 'perspective(800px) rotateX(-2deg) scale(0.98)',
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
                transform: { duration: 0.3 }
              }
            }}
          >
            {(() => {
              const day = weatherData.forecast.forecastday[expandedForecast];
              const date = new Date(day.date);
              const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric'
              });
              
              return (
                <>
                  <ExpandedForecastHeader
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>
                      {formattedDate}
                      <span>{day.day.condition.text}</span>
                    </h4>
                    <CloseButton
                      onClick={() => toggleForecast(expandedForecast)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX />
                    </CloseButton>
                  </ExpandedForecastHeader>
                  
                  {/* Hourly snippet */}
                  <HourlySnippet
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    {day.hour
                      .filter((_, i) => i % 3 === 0) // Show every 3 hours
                      .map((hourData, index) => {
                        const hourTime = new Date(hourData.time);
                        return (
                          <HourlySnippetItem 
                            key={hourData.time}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: 0.1 + (index * 0.05) 
                            }}
                          >
                            <div className="time">
                              {hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                            </div>
                            <div className="icon">
                              <WeatherIcon 
                                code={hourData.condition.code} 
                                isDay={hourData.is_day === 1} 
                                size="small"
                              />
                            </div>
                            <div className="temp">
                              {getTemperature(hourData.temp_c, hourData.temp_f)}°
                            </div>
                          </HourlySnippetItem>
                        );
                      })}
                  </HourlySnippet>
                  
                  <ExpandedForecastGrid>
                    <ExpandedForecastSection
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <DetailGroup>
                        <h5>Temperature</h5>
                        <DetailValue>
                          <BsThermometerHigh />
                          {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}
                          <span className="unit">°{unit}</span>
                        </DetailValue>
                        <DetailValue>
                          <BsThermometerLow />
                          {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}
                          <span className="unit">°{unit}</span>
                        </DetailValue>
                      </DetailGroup>
                      
                      <DetailGroup>
                        <h5>Precipitation</h5>
                        <DetailValue>
                          <BsCloudRain />
                          {day.day.daily_chance_of_rain}
                          <span className="unit">%</span>
                        </DetailValue>
                        <DetailValue>
                          <BsWater />
                          {unit === 'C' 
                            ? `${day.day.totalprecip_mm} mm`
                            : `${day.day.totalprecip_in} in`}
                        </DetailValue>
                      </DetailGroup>
                    </ExpandedForecastSection>
                    
                    <ExpandedForecastSection
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <DetailGroup>
                        <h5>Wind</h5>
                        <DetailValue>
                          <WiStrongWind />
                          {unit === 'C' 
                            ? `${day.day.maxwind_kph} km/h`
                            : `${day.day.maxwind_mph} mph`}
                        </DetailValue>
                      </DetailGroup>
                      
                      <DetailGroup>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h5>Other Conditions</h5>
                          <InfoIcon 
                            ref={infoIconRef}
                            onTouchStart={() => handleTooltipShow('conditions')}
                            onMouseEnter={() => handleTooltipShow('conditions')}
                          >
                            <FiInfo />
                          </InfoIcon>
                        </div>
                        <DetailValue>
                          <WiHumidity />
                          {day.day.avghumidity}
                          <span className="unit">%</span>
                        </DetailValue>
                        <DetailValue>
                          <BsEye />
                          {unit === 'C' 
                            ? `${day.day.avgvis_km} km`
                            : `${day.day.avgvis_miles} mi`}
                        </DetailValue>
                        <DetailValue>
                          <WiThermometer />
                          UV: <UVIndicator uv={day.day.uv}>{day.day.uv}</UVIndicator>
                        </DetailValue>
                      </DetailGroup>
                    </ExpandedForecastSection>
                    
                    <ExpandedForecastSection
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <DetailGroup>
                        <h5>Sun & Moon</h5>
                        <AstroInfo>
                          <DetailValue>
                            <BsSunrise />
                            {day.astro.sunrise}
                          </DetailValue>
                          <DetailValue>
                            <BsSunset />
                            {day.astro.sunset}
                          </DetailValue>
                        </AstroInfo>
                        <MoonPhase
                          moonPhaseStr={day.astro.moon_phase}
                          moonIllumination={day.astro.moon_illumination}
                          size={50}
                        />
                      </DetailGroup>
                    </ExpandedForecastSection>
                    
                    {day.day.daily_chance_of_snow > 0 && (
                      <ExpandedForecastSection
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <DetailGroup>
                          <h5>Snow</h5>
                          <DetailValue>
                            <BsSnow />
                            {day.day.daily_chance_of_snow}
                            <span className="unit">%</span>
                          </DetailValue>
                          <DetailValue>
                            <FaIceCream />
                            {unit === 'C' 
                              ? `${day.day.totalsnow_cm} cm`
                              : `${(day.day.totalsnow_cm / 2.54).toFixed(1)} in`}
                          </DetailValue>
                        </DetailGroup>
                      </ExpandedForecastSection>
                    )}
                  </ExpandedForecastGrid>
                </>
              );
            })()}
          </FullWidthPanel>
        )}
      </AnimatePresence>

      <PortalTooltip 
        show={showTooltip === 'conditions'} 
        content={conditionsTooltipContent}
        anchorEl={infoIconRef}
        onMouseEnter={() => handleTooltipShow('conditions')}
        onMouseLeave={handleTooltipHide}
      />
    </ForecastContainer>
  );
};

export default Forecast; 