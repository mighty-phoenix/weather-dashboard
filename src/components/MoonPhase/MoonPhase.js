import React from 'react';
import styled from 'styled-components';
import Moon from 'react-moon';
import { motion } from 'framer-motion';

const MoonPhaseContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;

const MoonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const MoonLabel = styled.p`
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
`;

const MoonInfo = styled.p`
  font-size: 0.85rem;
  margin: 4px 0 0 0;
  opacity: 0.8;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;

/**
 * Converts moon phase string to a numeric value between 0 and 1
 * @param {string} moonPhaseStr - Moon phase from API (e.g. "Waxing Crescent")
 * @return {number} - Value between 0 and 1 (New Moon=0, Full Moon=0.5, New Moon=1) 
 */
const getMoonPhaseValue = (moonPhaseStr) => {
  const phases = {
    'New Moon': 0,
    'Waxing Crescent': 0.125,
    'First Quarter': 0.25,
    'Waxing Gibbous': 0.375,
    'Full Moon': 0.5,
    'Waning Gibbous': 0.625,
    'Last Quarter': 0.75,
    'Waning Crescent': 0.875
  };
  
  return phases[moonPhaseStr] || 0;
};

const MoonPhase = ({ moonPhaseStr, moonIllumination, size = 60 }) => {
  const phaseValue = getMoonPhaseValue(moonPhaseStr);
  
  // Log for debugging
  console.log(`Moon phase: ${moonPhaseStr}, value: ${phaseValue}, API illumination: ${moonIllumination}%`);
  
  return (
    <MoonPhaseContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <MoonWrapper>
        <Moon 
          phase={phaseValue} 
          size={size} 
          lightColor="#FFFFFF"
          darkColor="#121212"
          border="1px solid rgba(255, 255, 255, 0.2)"
        />
      </MoonWrapper>
      <MoonLabel>{moonPhaseStr}</MoonLabel>
      <MoonInfo>Illumination: {moonIllumination}%</MoonInfo>
    </MoonPhaseContainer>
  );
};

export default MoonPhase; 