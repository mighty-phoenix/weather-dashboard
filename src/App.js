import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useWeather } from './hooks/useWeather';
import { trackEvent } from './utils/analytics';
import StickySearchBarComponent from './components/StickySearchBar';
import CurrentWeather from './components/CurrentWeather';
import AdditionalInfo from './components/AdditionalInfo';
import HourlyForecast from './components/HourlyForecast';
import WeatherBackground from './components/WeatherBackground';
import Forecast from './components/Forecast';
import SEO from './components/SEO';
import {
  AppContainer,
  WeatherDashboard,
  GlobalTextColor,
  LoadingContainer,
  Loader,
  ErrorMessage,
  Attribution
} from './styles/AppStyles';
import { HourlyForecastWrapper } from './styles/ForecastStyles';
import { GlobalTypography } from './styles/TypographyStyles';
import {
  getTextColor
} from './utils/weatherUtils';
import './App.css';

function App() {
  const {
    weatherData,
    loading,
    error,
    location,
    setLocation,
    inputText,
    handleInputChange,
    suggestions,
    selectSuggestion,
    clearSuggestions,
    handleSearch,
    getCurrentLocation,
    unit,
    toggleUnit,
    getTemperature,
    isSearching,
    selectFeaturedLocation
  } = useWeather();

  const [expandedForecast, setExpandedForecast] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const weatherDashboardRef = useRef(null);

  // Function to scroll to weather dashboard
  const scrollToWeatherDashboard = () => {
    if (weatherDashboardRef.current) {
      weatherDashboardRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Update current time based on API data
  useEffect(() => {
    if (!weatherData || !weatherData.forecast) return;

    const currentTime = new Date(weatherData.location.localtime);
    
    // Use currentTime which is now based on the API's location time
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // Parse sunrise and sunset times
    const sunriseTime = weatherData.forecast.forecastday[0].astro.sunrise;
    const sunsetTime = weatherData.forecast.forecastday[0].astro.sunset;
    
    // Extract hours and minutes accounting for AM/PM format
    const parseTimeString = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period && period.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      } else if (period && period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
      
      return { hours, minutes };
    };
    
    const sunrise = parseTimeString(sunriseTime);
    const sunset = parseTimeString(sunsetTime);
    
    const sunriseInMinutes = sunrise.hours * 60 + sunrise.minutes;
    const sunsetInMinutes = sunset.hours * 60 + sunset.minutes;
    
    // Set isDay based on current time
    setIsDay(timeInMinutes >= sunriseInMinutes && timeInMinutes < sunsetInMinutes);
  }, [weatherData]);


  const toggleForecast = (index) => {
    setExpandedForecast(expandedForecast === index ? null : index);
    // Track forecast toggle event
    trackEvent('User Interaction', 'Toggle Forecast', `Day ${index}`);
  };

  // Get text color based on background and time
  const textColor = weatherData ? getTextColor(weatherData, isDay) : {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.95)',
    tertiary: 'rgba(255, 255, 255, 0.9)',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
  };

  return (
    <AppContainer>
      {/* Dynamic SEO component */}
      {weatherData && (
        <SEO 
          weatherData={weatherData} 
          location={location}
          error={error}
        />
      )}
      <GlobalTextColor colors={textColor} />
      <GlobalTypography />
      <WeatherBackground weatherData={weatherData} isDay={isDay} />
      
      {/* Sticky Search Bar */}
      <StickySearchBarComponent
        location={location}
        setLocation={setLocation}
        inputText={inputText}
        handleInputChange={handleInputChange}
        suggestions={suggestions}
        selectSuggestion={selectSuggestion}
        clearSuggestions={clearSuggestions}
        handleSearch={handleSearch}
        getCurrentLocation={getCurrentLocation}
        unit={unit}
        toggleUnit={toggleUnit}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        isSearching={isSearching}
        selectFeaturedLocation={selectFeaturedLocation}
        scrollToWeatherDashboard={scrollToWeatherDashboard}
        weatherData={weatherData}
        getTemperature={getTemperature}
      />
      
      {/* Main Weather Dashboard Container */}
      <WeatherDashboard 
        ref={weatherDashboardRef} 
        className="weather-dashboard glass"
        as="main"
        aria-label="Weather Dashboard"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingContainer
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loader />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading weather data...
              </motion.p>
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          ) : weatherData && weatherData.forecast && weatherData.forecast.forecastday ? (
            <motion.div
              key="weather-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CurrentWeather 
                weatherData={weatherData} 
                unit={unit} 
                getTemperature={getTemperature}
                isDay={isDay}
              />
              
              <HourlyForecastWrapper>
                <HourlyForecast 
                  weatherData={weatherData} 
                  unit={unit} 
                  getTemperature={getTemperature} 
                  isDay={isDay}
                  currentTime={new Date(weatherData.location.localtime)}
                />
              </HourlyForecastWrapper>
              
              <AdditionalInfo 
                weatherData={weatherData}
                unit={unit}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
                getTemperature={getTemperature}
              />
              
              <Forecast 
                weatherData={weatherData}
                unit={unit}
                expandedForecast={expandedForecast}
                toggleForecast={toggleForecast}
                getTemperature={getTemperature}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
              />
              
                <Attribution>
                  Created with ❤️ by <a href="https://www.linkedin.com/in/rakshit-kumar-a8b11914b/" target="_blank" rel="noopener noreferrer">Rakshit Kumar</a> | <a href="https://github.com/mighty-phoenix/weather-dashboard" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaGithub /> GitHub - Source Code</a>
                </Attribution>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </WeatherDashboard>
    </AppContainer>
  );
}

export default App;