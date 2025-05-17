import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { trackEvent } from '../utils/analytics';

// API key for weatherapi.com
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'YOUR_WEATHERAPI_COM_API_KEY';
const BASE_URL = 'https://api.weatherapi.com/v1';

// LocalStorage key
const LOCATION_STORAGE_KEY = 'weather_dashboard_location';

// Add logging helper
const logWeatherData = (data) => {
};

export const useWeather = () => {
  // Get saved location from localStorage or use default
  const getSavedLocation = () => {
    try {
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      return savedLocation || 'London';
    } catch (err) {
      console.error('Error accessing localStorage:', err);
      return 'London';
    }
  };

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(getSavedLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // C for Celsius, F for Fahrenheit
  const [suggestions, setSuggestions] = useState([]);
  const [inputText, setInputText] = useState(getSavedLocation);
  const [isSearching, setIsSearching] = useState(false);
  // Add a ref to track initial fetch
  const initialFetchRef = useRef(false);
  // Add debounce timer ref
  const debounceTimerRef = useRef(null);

  // Fetch weather data
  const fetchWeatherData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: query,
          days: 10,
          aqi: 'yes',
          alerts: 'yes'
        }
      });
      
      // Log the API response for debugging
      logWeatherData(response.data);
      
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      // Set a more user-friendly error message that won't be indexed
      setError('Weather data temporarily unavailable. Please try again in a moment.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch autocomplete suggestions with debounce
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query
        }
      });
      console.log(response.data);
      
      setSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced version of input change handler
  const handleInputChange = (text) => {
    setInputText(text);
    setLocation(text);
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Check if localStorage has a value and safely compare
    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!savedLocation || !savedLocation.includes(text)) {
      // Set a new timer to delay the API call
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 300); // 300ms debounce time
    } else {
      setSuggestions([]);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    const locationName = suggestion.name;
    const fullName = `${locationName}`;
    
    // Always update UI state
    setLocation(fullName);
    setInputText(fullName);
    setSuggestions([]);
    
    // Only fetch new data if it's a different location
    const currentLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (currentLocation !== fullName) {
      fetchWeatherData(suggestion.url || fullName);
      
      // Save to localStorage
      try {
        localStorage.setItem(LOCATION_STORAGE_KEY, fullName);
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Only fetch and track if there's actual location data
    if (location && location.trim()) {
      // Check if we're searching for the same location
      const currentLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      const shouldFetch = currentLocation !== location || !weatherData;
      
      if (shouldFetch) {
        fetchWeatherData(location);
      }
      
      // Track search event
      trackEvent('User Interaction', 'Location Search', location);
      
      // Save to localStorage only if it's a new location
      if (currentLocation !== location) {
        try {
          localStorage.setItem(LOCATION_STORAGE_KEY, location);
        } catch (err) {
          console.error('Error saving to localStorage:', err);
        }
      }
    }
    
    // Always clear suggestions
    setSuggestions([]);
  };

  // Clear debounce timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    // Track geolocation request event
    trackEvent('User Interaction', 'Use Current Location');
    
    if (navigator.geolocation) {
      // Set options for better compatibility with mobile Safari
      const options = {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout for slower connections
        maximumAge: 0 // Don't use cached position
      };
      
      // Show loading state while waiting for geolocation
      setLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = `${latitude},${longitude}`;
          
          // Temporarily show coordinates in the search bar while fetching
          setLocation('Getting location...');
          setInputText('Getting location...');
          
          // Custom fetch function to update location name after data is retrieved
          const fetchLocationData = async (coordinates) => {
            try {
              const response = await axios.get(`${BASE_URL}/forecast.json`, {
                params: {
                  key: API_KEY,
                  q: coordinates,
                  days: 10,
                  aqi: 'yes',
                  alerts: 'yes'
                }
              });
              
              // Log the API response for debugging
              logWeatherData(response.data);
              
              // Update weather data
              setWeatherData(response.data);
              
              // Update location text in search bar with actual city name
              if (response.data && response.data.location) {
                const { name, region } = response.data.location;
                const locationName = region ? `${name}, ${region}` : name;
                setLocation(locationName);
                setInputText(locationName);
                
                // Save to localStorage
                try {
                  localStorage.setItem(LOCATION_STORAGE_KEY, locationName);
                } catch (err) {
                  console.error('Error saving to localStorage:', err);
                }
              }
              
              setError(null);
            } catch (err) {
              setError('Failed to fetch weather data. Please try again.');
              console.error('Error fetching weather data:', err);
            } finally {
              setLoading(false);
            }
          };
          
          // Call the custom fetch function
          fetchLocationData(coords);
        },
        (err) => {
          setLoading(false);
          console.log('Geolocation error:', err);
          
          // More specific error messages based on error code
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('Location access was denied. Please enable location services in your browser settings.');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('Location information is unavailable. Please try again later.');
              break;
            case err.TIMEOUT:
              setError('Location request timed out. Please try again.');
              break;
            default:
              setError('Unable to get your location. Please try again or enter a location manually.');
          }
          
          // Fallback to default location if geolocation fails
          fetchWeatherData(location);
        },
        options
      );
    } else {
      console.log('Geolocation is not supported by your browser');
      setError('Geolocation is not supported by your browser');
      // Fallback to default location
      fetchWeatherData(location);
    }
  };

  // Toggle temperature unit
  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    // Track unit toggle event
    trackEvent('User Interaction', 'Toggle Temperature Unit', `Changed to ${newUnit}`);
  };

  // Get temperature in the current unit
  const getTemperature = (temp_c, temp_f) => {
    if (unit === 'C') return temp_c;
    return temp_f;
  };

  // Clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  // Select a featured location
  const selectFeaturedLocation = (locationName) => {
    // Always update UI state
    setLocation(locationName);
    setInputText(locationName);
    setSuggestions([]);
    
    // Track featured location selection (even if it's the same city, user clicked it)
    trackEvent('User Interaction', 'Select Featured Location', locationName);
    
    // Only fetch new data and update localStorage if it's a different location
    if (location !== locationName) {
      fetchWeatherData(locationName);
      
      // Save to localStorage
      try {
        localStorage.setItem(LOCATION_STORAGE_KEY, locationName);
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    }
  };

  // Initial fetch - modified to use ref to prevent double fetching
  useEffect(() => {
    // Only fetch if we haven't already done the initial fetch
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchWeatherData(location);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
}; 