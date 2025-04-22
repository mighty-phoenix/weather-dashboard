import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for dynamic metadata updates using react-helmet-async
 * This component provides better SEO through server-side rendering
 */
const SEO = ({ weatherData, location, error }) => {
  // Default meta tags for the site
  const defaultMeta = {
    title: 'WeatherGala - Advanced Weather Dashboard & Forecasts',
    description: 'Get accurate weather forecasts, hourly predictions, and detailed weather information for any location worldwide.',
    keywords: 'weather, forecast, temperature, humidity, wind, precipitation, weather dashboard, weather app',
    robots: 'index, follow'
  };

  // If there's an error, use default meta tags with noindex
  if (error) {
    return (
      <Helmet>
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />
        <meta name="keywords" content={defaultMeta.keywords} />
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
      </Helmet>
    );
  }

  // If no weather data is available yet, use default meta tags
  if (!weatherData || !weatherData.location) {
    return (
      <Helmet>
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />
        <meta name="keywords" content={defaultMeta.keywords} />
        <meta name="robots" content={defaultMeta.robots} />
      </Helmet>
    );
  }
  
  // Extract location information
  const { name, region, country } = weatherData.location;
  const locationString = region 
    ? `${name}, ${region}, ${country}` 
    : `${name}, ${country}`;
  
  // Extract current weather information
  const currentCondition = weatherData.current.condition.text;
  const currentTemp = weatherData.current.temp_c;
  
  // Create structured data for weather
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Weather forecast for ${name}`,
    description: `Current weather and forecast for ${name}, ${country}`,
    mainEntity: {
      '@type': 'CurrentWeather',
      temperature: {
        '@type': 'QuantitativeValue',
        value: currentTemp,
        unitCode: 'CEL'
      },
      feelsLike: {
        '@type': 'QuantitativeValue',
        value: weatherData.current.feelslike_c,
        unitCode: 'CEL'
      },
      humidity: {
        '@type': 'QuantitativeValue',
        value: weatherData.current.humidity,
        unitCode: '%'
      },
      windSpeed: {
        '@type': 'QuantitativeValue',
        value: weatherData.current.wind_kph,
        unitCode: 'KM/H'
      },
      sunrise: {
        '@type': 'Time',
        value: weatherData.forecast.forecastday[0].astro.sunrise
      },
      sunset: {
        '@type': 'Time',   
        value: weatherData.forecast.forecastday[0].astro.sunset
      },
      description: currentCondition,
      geographicLocation: {
        '@type': 'Place',
        name: name,
        address: {
          '@type': 'PostalAddress',
          addressCountry: country,
          addressRegion: region || ''
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: weatherData.location.lat,
          longitude: weatherData.location.lon
        }
      }
    }
  };

  return (
    <Helmet>
      <title>{`${name} Weather Forecast - Current Conditions & 10-Day Outlook | WeatherGala`}</title>
      <meta name="description" content={`Get current weather conditions and 10-day forecast for ${locationString}. Temperature: ${currentTemp}°C, Condition: ${currentCondition}. View detailed weather information including humidity, wind speed, and more.`} />
      <meta name="keywords" content={`${name} weather, ${locationString} forecast, ${currentCondition}, temperature, humidity, wind, weather forecast, weather dashboard`} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={`${name} Weather Forecast - Current Conditions & 10-Day Outlook`} />
      <meta property="og:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. View detailed forecast and weather information.`} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${name} Weather Forecast`} />
      <meta name="twitter:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}`} />
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO; 