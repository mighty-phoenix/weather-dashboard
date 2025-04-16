import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from './TypographyStyles';

export const AdditionalInfo = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoCard = styled(motion.div)`
  flex: 1;
  min-width: 200px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  transform-origin: center center;
  transition: all 0.2s ease-out;

  h4 {
    color: var(--text-primary, #fff);
    margin-top: 0;
    margin-bottom: 15px;
    font-size: ${FONT_SIZE.md};
    text-shadow: var(--text-shadow, 0 2px 5px rgba(0, 0, 0, 0.3));
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.medium};
  }

  p {
    color: var(--text-secondary, rgba(255, 255, 255, 0.9));
    margin: 10px 0;
    font-size: ${FONT_SIZE.base};
    line-height: ${LINE_HEIGHT.normal};
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InfoIcon = styled.div`
  position: relative;
  color: rgba(255, 255, 255, 0.7);
  cursor: help;
  
  @media (max-width: 768px) {
    padding: 8px;
    margin: -8px;
    
    &:active {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: ${FONT_SIZE.xs};
  width: 220px;
  z-index: 1000;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  line-height: ${LINE_HEIGHT.normal};
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
  
  &.tooltip-left {
    left: 10px;
    transform: none;
    
    &:after {
      left: 20px;
      transform: none;
    }
  }
  
  &.tooltip-right {
    left: auto;
    right: 10px;
    transform: none;
    
    &:after {
      left: auto;
      right: 20px;
      transform: none;
    }
  }
  
  @media (max-width: 768px) {
    width: 180px;
    padding: 8px;
    position: fixed;
    bottom: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 80vw;
    z-index: 1100;
    
    &:before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
    
    &.tooltip-left, &.tooltip-right {
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
      
      &:after {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }
    }
  }
`;

export const TooltipTitle = styled.div`
  font-weight: ${FONT_WEIGHT.semibold};
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
  font-size: ${FONT_SIZE.sm};
`;

export const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const TooltipItem = styled.div`
  font-size: ${FONT_SIZE.xs};
  line-height: ${LINE_HEIGHT.normal};
`;

export const AirQualityDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

export const AQIMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AQIValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

export const AQINumber = styled.span`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.bold};
  text-align: center;
`;

export const AQILabel = styled.span`
  font-size: ${FONT_SIZE.sm};
  opacity: 0.7;
`;

export const AQIPollutantRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin-top: 10px;
  position: relative;
  padding: 3px 0;
`;

export const AQIPollutant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px;
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  transform-origin: center center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

export const AirQualityBar = styled.div`
  height: 6px;
  background: linear-gradient(to right, #4caf50, #ffeb3b, #ff9800, #f44336, #9c27b0, #7e0023);
  border-radius: 3px;
  position: relative;
  margin: 5px 0;

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    top: 50%;
    left: ${props => ((props.quality - 1) / 5) * 100}%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: left 0.3s ease;
  }
`;

export const AQICategory = styled.div`
  font-size: ${FONT_SIZE.base};
  font-weight: ${FONT_WEIGHT.semibold};
  text-align: center;
  color: ${props => {
    const index = props.index || 1;
    if (index <= 1) return '#4caf50'; // Good
    if (index <= 2) return '#ffeb3b'; // Moderate
    if (index <= 3) return '#ff9800'; // Unhealthy for Sensitive Groups
    if (index <= 4) return '#f44336'; // Unhealthy
    if (index <= 5) return '#9c27b0'; // Very Unhealthy
    return '#7e0023'; // Hazardous
  }};
`;

export const PollutantName = styled.div`
  font-size: ${FONT_SIZE.md};
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3px;
  line-height: ${LINE_HEIGHT.normal};
`;

export const PollutantValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: ${FONT_WEIGHT.semibold};
  color: ${props => {
    switch(props.level) {
      case 0: return '#4caf50'; // Good
      case 1: return '#ffeb3b'; // Moderate
      case 2: return '#ff9800'; // Unhealthy for Sensitive Groups
      case 3: return '#f44336'; // Unhealthy or worse
      default: return 'white';
    }
  }};
`;

export const PollutantNumber = styled.div`
  font-size: ${FONT_SIZE.sm};
  margin-bottom: 1px;
  line-height: ${LINE_HEIGHT.tight};
`;

export const PollutantUnit = styled.span`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: 3px;
`;

export const AstroContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
`;

export const AstroItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AstroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 8px;
  color: var(--text-primary, #fff);
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const AstroTime = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

export const AstroDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 0 15px 0;
  width: 100%;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const DetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

export const DetailValue = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`; 