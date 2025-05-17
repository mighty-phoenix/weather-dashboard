import ReactGA from 'react-ga4';

// Initialize Google Analytics with the measurement ID
export const initializeGA = () => {
  ReactGA.initialize('G-CMYT1214QH');
};

// Track page views
export const trackPageView = (page) => {
  ReactGA.send({ hitType: 'pageview', page });
};

// Track user events
export const trackEvent = (category, action, label = null, value = null) => {
  // Ensure value is numeric or null/undefined
  const numericValue = value !== null && value !== undefined ? 
    (typeof value === 'number' ? value : Number(value)) : undefined;
  
  // Only include the value if it's a valid number
  const eventParams = {
    category,
    action,
    ...(label && { label }),
    ...(numericValue !== undefined && !isNaN(numericValue) && { value: numericValue })
  };
  
  ReactGA.event(eventParams);
};

// Session duration tracking
let sessionStartTime = null;
let sessionDurationInterval = null;

// Initialize session tracking
export const initializeSessionTracking = () => {
  // Record session start time
  sessionStartTime = new Date();
  
  // Send initial session start event
  trackEvent('Session', 'Start', 'Session started');
  
  // Set up interval to track session duration every 30 seconds
  sessionDurationInterval = setInterval(() => {
    const currentTime = new Date();
    const durationInSeconds = Math.floor((currentTime - sessionStartTime) / 1000);
    
    // Only track if more than 30 seconds have passed
    if (durationInSeconds > 30) {
      const durationInMinutes = Math.floor(durationInSeconds / 60);
      trackEvent('Session', 'Duration', `${durationInMinutes} minutes`, durationInSeconds);
    }
  }, 30000); // 30 seconds
  
  // Track when user leaves the page
  window.addEventListener('beforeunload', () => {
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - sessionStartTime) / 1000);
    
    // Track session end
    trackEvent('Session', 'End', 'Session ended', durationInSeconds);
    
    // Clear the interval
    if (sessionDurationInterval) {
      clearInterval(sessionDurationInterval);
    }
  });
}; 