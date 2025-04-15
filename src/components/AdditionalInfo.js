import React from 'react';
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

const AdditionalInfo = ({
  weatherData,
  unit,
  showTooltip,
  setShowTooltip,
  getTemperature
}) => {
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
            onMouseEnter={() => setShowTooltip('aqi')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <FiInfo />
            {showTooltip === 'aqi' && (
              <Tooltip>
                <TooltipTitle>US EPA Air Quality Index</TooltipTitle>
                <TooltipContent>
                  <TooltipItem>Good (0-50)</TooltipItem>
                  <TooltipItem>Moderate (51-100)</TooltipItem>
                  <TooltipItem>Unhealthy for Sensitive Groups (101-150)</TooltipItem>
                  <TooltipItem>Unhealthy (151-200)</TooltipItem>
                  <TooltipItem>Very Unhealthy (201-300)</TooltipItem>
                  <TooltipItem>Hazardous (301+)</TooltipItem>
                </TooltipContent>
              </Tooltip>
            )}
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
            onClick={() => setShowTooltip(showTooltip === 'pm2_5' ? null : 'pm2_5')}
            className="pollutant-left"
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
              <Tooltip className="tooltip-left">
                {getPollutantInfo('pm2_5')}
              </Tooltip>
            )}
          </AQIPollutant>
          
          <AQIPollutant
            onMouseEnter={() => setShowTooltip('pm10')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip(showTooltip === 'pm10' ? null : 'pm10')}
            className="pollutant-center"
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
              <Tooltip>
                {getPollutantInfo('pm10')}
              </Tooltip>
            )}
          </AQIPollutant>
          
          <AQIPollutant
            onMouseEnter={() => setShowTooltip('o3')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowTooltip(showTooltip === 'o3' ? null : 'o3')}
            className="pollutant-right"
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
              <Tooltip className="tooltip-right">
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
    </StyledAdditionalInfo>
  );
};

export default AdditionalInfo; 