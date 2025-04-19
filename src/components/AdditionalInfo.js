import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FiInfo } from 'react-icons/fi';
import { WiSunrise, WiSunset } from 'react-icons/wi';
import MoonPhase from './MoonPhase';
import {
  getAQICategory,
  getAQIRange,
  getPollutantLevel,
  getPollutantEmoji,
  getPollutantInfo
} from '../utils/weatherUtils';
import {
  AdditionalInfo as StyledAdditionalInfo,
  InfoCard,
  InfoHeader,
  InfoIcon,
  Tooltip,
  TooltipTitle,
  TooltipContent,
  TooltipItem,
  AirQualityDisplay,
  AQIMainInfo,
  AQIValue,
  AQINumber,
  AirQualityBar,
  AQICategory,
  AQIPollutantRow,
  AQIPollutant,
  PollutantName,
  PollutantValue,
  PollutantNumber,
  PollutantUnit,
  AstroContainer,
  AstroItem,
  AstroIcon,
  AstroTime,
  AstroDivider,
  DetailRow,
  DetailLabel,
  DetailValue
} from '../styles/AdditionalInfoStyles';

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
      const top = rect.top - 10;
      const left = Math.min(rect.left - 220, window.innerWidth - 260);
      
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
      }}
      onClick={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </div>,
    document.body
  );
};

const AdditionalInfo = ({
  weatherData,
  unit,
  showTooltip,
  setShowTooltip,
  getTemperature
}) => {
  // References for tooltip positioning
  const aqiInfoIconRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Handle dismissing tooltips when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only run this on mobile devices
      if (window.innerWidth <= 768 && showTooltip) {
        // Check if the click was on a tooltip or info icon
        if (!e.target.closest('.tooltip') && !e.target.closest('.info-icon')) {
          setShowTooltip(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTooltip, setShowTooltip]);

  const handleTooltipShow = (tooltipId) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(tooltipId);
  };

  const handleTooltipHide = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(null);
    }, 300); // 300ms delay before hiding
  };

  // AQI tooltip content
  const aqiTooltipContent = (
    <>
      <TooltipTitle>US EPA Air Quality Index</TooltipTitle>
      <TooltipContent>
        <TooltipItem>Good (0-50)</TooltipItem>
        <TooltipItem>Moderate (51-100)</TooltipItem>
        <TooltipItem>Unhealthy for Sensitive Groups (101-150)</TooltipItem>
        <TooltipItem>Unhealthy (151-200)</TooltipItem>
        <TooltipItem>Very Unhealthy (201-300)</TooltipItem>
        <TooltipItem>Hazardous (301+)</TooltipItem>
      </TooltipContent>
    </>
  );

  // Guard clause to prevent errors when weatherData or forecast data is not available
  if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
    return null;
  }
  
  return (
    <StyledAdditionalInfo
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <InfoCard
        whileHover={{ 
          y: -5,
          scale: 1.03,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="glass-dark"
      >
        <InfoHeader>
          <h4>Air Quality</h4>
          <InfoIcon 
            ref={aqiInfoIconRef}
            onTouchStart={() => handleTooltipShow('aqi')}
            onMouseEnter={() => handleTooltipShow('aqi')}
            className="info-icon"
          >
            <FiInfo />
          </InfoIcon>
        </InfoHeader>
        
        <AirQualityDisplay>
          <AQIMainInfo>
            <AQIValue>
              <AQINumber>{getAQIRange(weatherData.current.air_quality?.['us-epa-index'] || 1)}</AQINumber>
            </AQIValue>
            <AQICategory index={weatherData.current.air_quality?.['us-epa-index'] || 1}>
              {getAQICategory(weatherData.current.air_quality?.['us-epa-index'] || 1)}
            </AQICategory>
          </AQIMainInfo>

          <AirQualityBar quality={weatherData.current.air_quality?.['us-epa-index'] || 1} />
        </AirQualityDisplay>
        
        <AQIPollutantRow>
          <AQIPollutant 
            onMouseEnter={() => setShowTooltip('pm2_5')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip('pm2_5')}
            className="pollutant-left info-icon"
          >
            <PollutantName>PM2.5</PollutantName>
            <PollutantValue level={getPollutantLevel(weatherData.current.air_quality?.pm2_5 || 0, 'pm2_5')}>
              <PollutantNumber>
                {weatherData.current.air_quality?.pm2_5?.toFixed(1) || 'N/A'}
              </PollutantNumber>
              <PollutantUnit>μg/m³</PollutantUnit>
              {getPollutantEmoji(getPollutantLevel(weatherData.current.air_quality?.pm2_5 || 0, 'pm2_5'))}
            </PollutantValue>
            {showTooltip === 'pm2_5' && (
              <Tooltip className="tooltip tooltip-left">
                {getPollutantInfo('pm2_5')}
              </Tooltip>
            )}
          </AQIPollutant>
          
          <AQIPollutant
            onMouseEnter={() => setShowTooltip('pm10')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip('pm10')}
            className="pollutant-center info-icon"
          >
            <PollutantName>PM10</PollutantName>
            <PollutantValue level={getPollutantLevel(weatherData.current.air_quality?.pm10 || 0, 'pm10')}>
              <PollutantNumber>
                {weatherData.current.air_quality?.pm10?.toFixed(1) || 'N/A'}
              </PollutantNumber>
              <PollutantUnit>μg/m³</PollutantUnit>
              {getPollutantEmoji(getPollutantLevel(weatherData.current.air_quality?.pm10 || 0, 'pm10'))}
            </PollutantValue>
            {showTooltip === 'pm10' && (
              <Tooltip className="tooltip">
                {getPollutantInfo('pm10')}
              </Tooltip>
            )}
          </AQIPollutant>
          
          <AQIPollutant
            onMouseEnter={() => setShowTooltip('o3')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip('o3')}
            className="pollutant-right info-icon"
          >
            <PollutantName>O₃</PollutantName>
            <PollutantValue level={getPollutantLevel(weatherData.current.air_quality?.o3 || 0, 'o3')}>
              <PollutantNumber>
                {weatherData.current.air_quality?.o3?.toFixed(1) || 'N/A'}
              </PollutantNumber>
              <PollutantUnit>μg/m³</PollutantUnit>
              {getPollutantEmoji(getPollutantLevel(weatherData.current.air_quality?.o3 || 0, 'o3'))}
            </PollutantValue>
            {showTooltip === 'o3' && (
              <Tooltip className="tooltip tooltip-right">
                {getPollutantInfo('o3')}
              </Tooltip>
            )}
          </AQIPollutant>
        </AQIPollutantRow>
      </InfoCard>
      <InfoCard
        whileHover={{ 
          y: -5,
          scale: 1.03,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="glass-dark"
      >
        <h4>Sunrise & Sunset</h4>
        <AstroContainer>
          <AstroItem>
            <AstroIcon>
              <WiSunrise />
            </AstroIcon>
            <AstroTime>{weatherData.forecast.forecastday[0].astro.sunrise}</AstroTime>
          </AstroItem>
          <AstroItem>
            <AstroIcon>
              <WiSunset />
            </AstroIcon>
            <AstroTime>{weatherData.forecast.forecastday[0].astro.sunset}</AstroTime>
          </AstroItem>
        </AstroContainer>
        <AstroDivider />
        <MoonPhase 
          moonPhaseStr={weatherData.forecast.forecastday[0].astro.moon_phase}
          moonIllumination={weatherData.forecast.forecastday[0].astro.moon_illumination}
          size={50}
        />
      </InfoCard>
      <InfoCard
        whileHover={{ 
          y: -5,
          scale: 1.03,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="glass-dark"
      >
        <h4>Pressure & Visibility</h4>
        <DetailRow>
          <DetailLabel>Pressure</DetailLabel>
          <DetailValue>
            {unit === 'C' 
              ? `${weatherData.current.pressure_mb} mb` 
              : `${weatherData.current.pressure_in} in`}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Visibility</DetailLabel>
          <DetailValue>
            {unit === 'C'
              ? `${weatherData.current.vis_km} km`
              : `${weatherData.current.vis_miles} mi`}
          </DetailValue>
        </DetailRow>
      </InfoCard>

      {/* Portal Tooltip for AQI */}
      <PortalTooltip 
        show={showTooltip === 'aqi'} 
        content={aqiTooltipContent}
        anchorEl={aqiInfoIconRef}
        onMouseEnter={() => handleTooltipShow('aqi')}
        onMouseLeave={handleTooltipHide}
      />
    </StyledAdditionalInfo>
  );
};

export default AdditionalInfo; 