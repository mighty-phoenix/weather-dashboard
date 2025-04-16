import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for dynamic metadata updates using react-helmet-async
 * This component provides better SEO through server-side rendering
 */
const SEO = ({ weatherData, location }) => {
  if (!weatherData || !weatherData.location) {
    return (
      <Helmet>
        <title>WeatherGala - Advanced Weather Dashboard & Forecasts</title>
        <meta name="description" content="Get accurate weather forecasts, hourly predictions, and detailed weather information for any location worldwide. Powered by weatherapi.com." />
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
      {/* Primary Meta Tags */}
      <title>{`${currentTemp}°C ${currentCondition} in ${name} | WeatherGala`}</title>
      <meta name="description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. Get hourly and daily forecasts, weather alerts, and detailed weather information for ${name}.`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://weathergala.vercel.app`} />
      <meta property="og:title" content={`${currentTemp}°C ${currentCondition} in ${name} | WeatherGala`} />
      <meta property="og:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. Get hourly and daily forecasts, weather alerts, and detailed weather information.`} />
      <meta property="og:image" content="https://weathergala.vercel.app/og.png" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://weathergala.vercel.app`} />
      <meta property="twitter:title" content={`${currentTemp}°C ${currentCondition} in ${name} | WeatherGala`} />
      <meta property="twitter:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. Get hourly and daily forecasts, weather alerts, and detailed weather information.`} />
      <meta property="twitter:image" content="https://weathergala.vercel.app/og.png" />
      
      {/* WhatsApp */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="WeatherGala" />
      
      {/* LinkedIn */}
      <meta property="linkedin:card" content="summary_large_image" />
      <meta property="linkedin:title" content={`${currentTemp}°C ${currentCondition} in ${name} | WeatherGala`} />
      <meta property="linkedin:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. Get hourly and daily forecasts, weather alerts, and detailed weather information.`} />
      <meta property="linkedin:image" content="https://weathergala.vercel.app/og.png" />
      
      {/* Pinterest */}
      <meta property="pinterest:image" content="https://weathergala.vercel.app/og.png" />
      <meta property="pinterest:description" content={`Current weather in ${locationString}: ${currentTemp}°C, ${currentCondition}. Get hourly and daily forecasts, weather alerts, and detailed weather information.`} />
      
      {/* Slack */}
      <meta name="slack-app-id" content="weather-gala" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://weathergala.vercel.app`} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO; 