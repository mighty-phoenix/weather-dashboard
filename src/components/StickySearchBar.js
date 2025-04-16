import React, { useRef, useEffect, useState } from 'react';
import { BiSearchAlt, BiWorld} from 'react-icons/bi';
import { FiMapPin } from "react-icons/fi";
import { RiTempColdLine, RiTempHotLine } from 'react-icons/ri';
import { SearchContainer, SearchInput, SearchButton, LocationButton, UnitToggle } from '../styles/AppStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StickySearchBar, 
  SearchBarInner, 
  FeaturedLocations, 
  LocationChip, 
  SuggestionsContainer, 
  SuggestionItem, 
  LoadingDots, 
  SearchInputWrapper} from '../styles/SearchStyles';

// Featured locations with diverse weather and timezones
const featuredLocations = [
  { 
    name: "Antillanca",
  },
  { 
    name: "Zermatt",
  },
  { 
    name: "London", 
  },
  { 
    name: "New York", 
  },
  { 
    name: "Sydney", 
  },
  { 
    name: "Dubai", 
  },
  {   
    name: "Rio de Janeiro", 
  },
  { 
    name: "Oslo", 
  },
  { 
    name: "Singapore", 
  }
];

const StickySearchBarComponent = ({ 
  inputText,
  handleInputChange,
  suggestions,
  selectSuggestion,
  clearSuggestions,
  handleSearch, 
  getCurrentLocation, 
  unit, 
  toggleUnit, 
  searchFocused, 
  setSearchFocused,
  isSearching,
  selectFeaturedLocation,
  scrollToWeatherDashboard,
  weatherData,
  getTemperature
}) => {
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGradient, setShowGradient] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update gradient visibility based on weather data and search focus
  useEffect(() => {
    setShowGradient(weatherData && !searchFocused);
  }, [weatherData, searchFocused]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prevIndex => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prevIndex => 
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      inputRef.current.blur();
    }
    // Escape
    else if (e.key === 'Escape') {
      clearSuggestions();
      inputRef.current.blur();
    }
  };

  // Format the current time

  // Handle featured location selection
  const handleFeaturedLocationClick = (location) => {
    selectFeaturedLocation(location.name);
  };
  
  // Track touch interactions to differentiate between scrolling and tapping
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const touchThreshold = 10; // Pixels of movement to consider as dragging
  
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(false);
  };
  
  const handleTouchMove = (e) => {
    if (Math.abs(e.touches[0].clientX - touchStartX) > touchThreshold) {
      setIsDragging(true);
    }
  };
  

  // Custom submit handler to also trigger scrolling
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    handleSearch(e);
    // Scroll to the weather dashboard after search
    setTimeout(() => {
      scrollToWeatherDashboard();
    }, 300);
  };

  return (
    <StickySearchBar
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        duration: 0.7
      }}
      style={{ animation: 'fadeInDown 0.8s ease-out forwards' }}
      className={isScrolled ? 'scrolled' : ''}
    >
      <SearchBarInner>
        <SearchContainer 
          onSubmit={handleSubmit} 
          style={{ margin: 0 }}
        >
          <SearchInputWrapper>
            {showGradient && (
              <div 
                style={{
                  position: 'absolute',
                  right: isMobile ? '62px' : '70px',
                  top: 0,
                  height: '100%',
                  width: isMobile ? '35px' : '30px',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
            )}
            
            <SearchInput
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a city..."
              onFocus={() => {
                if (!searchFocused && inputText) {
                  handleInputChange('');
                }
                setSearchFocused(true);
              }}
              onBlur={() => {
                setSearchFocused(false);
                if (inputText === '') {
                  handleInputChange(localStorage.getItem('weather_dashboard_location'));
                }
              }}
              className={searchFocused ? 'focused' : ''}
            />
            
            {weatherData && !searchFocused && (
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  pointerEvents: 'none',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50px',
                  padding: '4px 8px',
                  zIndex: 2,
                  minWidth: '60px',
                  justifyContent: 'center'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img 
                  src={weatherData.current.condition.icon} 
                  alt={weatherData.current.condition.text}
                  style={{ width: '22px', height: '22px' }}
                />
                <span>{getTemperature(weatherData.current.temp_c, weatherData.current.temp_f)}°{unit}</span>
              </motion.div>
            )}
            
            <AnimatePresence>
              {suggestions.length > 0 && (
                <SuggestionsContainer
                  className="hide-scrollbar"
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={suggestion.id || index}
                      onClick={() => selectSuggestion(suggestion)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        scale: 1.02,
                        transition: { duration: 0.1 }
                      }}
                      className={index === activeIndex ? 'active' : ''}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {suggestion.name}
                      {suggestion.region && <span>, {suggestion.region}</span>}
                      {suggestion.country && <span className="country">{suggestion.country}</span>}
                    </SuggestionItem>
                  ))}
                </SuggestionsContainer>
              )}
              
              {isSearching && inputText.length >= 2 && suggestions.length === 0 && (
                <SuggestionsContainer
                  className="hide-scrollbar"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SuggestionItem
                    style={{ justifyContent: 'center' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingDots>
                      <span>.</span><span>.</span><span>.</span>
                    </LoadingDots>
                  </SuggestionItem>
                </SuggestionsContainer>
              )}
            </AnimatePresence>
          </SearchInputWrapper>
          
          <SearchButton 
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
            onClick={handleSubmit}
          >
            <BiSearchAlt />
          </SearchButton>
          <LocationButton 
            type="button" 
            onClick={getCurrentLocation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
          >
            <FiMapPin size={18} />
          </LocationButton>
          <UnitToggle 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleUnit();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          >
            {unit === 'C' ? <RiTempColdLine /> : <RiTempHotLine />}
            °{unit}
          </UnitToggle>
        </SearchContainer>

        <FeaturedLocations
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="FeaturedLocations hide-scrollbar"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BiWorld size={24} style={{ color: 'rgba(255, 255, 255, 0.7)'}} />
          {featuredLocations.map((loc, index) => (
            <LocationChip
              key={index}
              onClick={() => !isDragging && handleFeaturedLocationClick(loc)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ 
                scale: 0.95, 
                y: 0,
                transition: { duration: 0.1 }
              }}
              onTapStart={(e) => {
                e.stopPropagation();
              }}
              onTapCancel={() => {
                // Reset dragging status on tap cancel
                setIsDragging(false);
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.1 + (index * 0.05),
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }
              }}
              className="location-chip shimmer"
            >
              {loc.name}
            </LocationChip>
          ))}
          </div>
        </FeaturedLocations>
      </SearchBarInner>
    </StickySearchBar>
  );
};

export default StickySearchBarComponent; 