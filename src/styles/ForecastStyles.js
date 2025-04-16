import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from './TypographyStyles';

export const ForecastContainer = styled(motion.div)`
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  h3 {
    color: #fff;
    margin: 0 0 15px 0;
    font-size: ${FONT_SIZE.lg};
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.semibold};
  }
`;

export const ForecastList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 5px 5px 15px 5px;
  padding-top: 10px;
  margin: 0 -5px;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar-track {
    margin: 0 5px;
  }
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`;

export const ForecastItem = styled(motion.div)`
  background: ${props => props.expanded ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 15px;
  padding: 16px 12px;
  min-width: 130px;
  width: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: ${props => props.expanded ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)'};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-out;
  margin: 4px 0;
  transform-origin: center center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5));
    opacity: ${props => props.expanded ? 1 : 0};
  }
  
  @media (max-width: 768px) {
    min-width: 120px;
    width: 120px;
    flex: 0 0 auto;
  }
  
  @media (max-width: 480px) {
    min-width: 110px;
    width: 110px;
  }
`;

export const ForecastTopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

export const ForecastDay = styled.div`
  font-size: ${FONT_SIZE.sm};
  color: #FFFFFF;
  font-weight: ${FONT_WEIGHT.medium};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  line-height: ${LINE_HEIGHT.normal};
`;

export const ForecastIcon = styled.div`
  margin: 4px 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

export const ForecastTemp = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
  color: #fff;
  margin: 4px 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: ${LINE_HEIGHT.tight};
`;

export const ForecastCondition = styled.div`
  font-size: ${FONT_SIZE.sm};
  color: #FFFFFF;
  text-align: center;
  min-height: 32px;
  max-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  line-height: 1.2;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: ${FONT_WEIGHT.medium};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

export const ExpandButton = styled(motion.div)`
  color: var(--text-tertiary, rgba(255, 255, 255, 0.7));
  font-size: ${FONT_SIZE.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  transition: color 0.3s ease;
  position: relative;
  
  /* Pulse animation for the expand button */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    opacity: 0;
    z-index: -1;
  }
  
  ${props => props.parent?.expanded ? `
    color: rgba(255, 255, 255, 0.9);
  ` : `
    &::after {
      animation: pulse 2s infinite;
    }
  `}
`;

// Deprecated - kept for backward compatibility
export const ExpandedForecast = styled(motion.div)`
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 10px;
`;

export const HourlyForecastContainer = styled(motion.div)`
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ForecastDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: ${FONT_SIZE.md};
  color: rgba(255, 255, 255, 0.9);
  line-height: ${LINE_HEIGHT.normal};
  
  span:first-child {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const UVIndicator = styled.span`
  font-weight: ${FONT_WEIGHT.semibold};
  color: ${props => {
    if (props.uv <= 2) return '#4caf50';
    if (props.uv <= 5) return '#ffeb3b';
    if (props.uv <= 7) return '#ff9800';
    return '#f44336';
  }};
`;

export const HourlyForecastWrapper = styled(motion.div)`
  margin-bottom: 30px;
`;

// New fullwidth expanded forecast panel
export const FullWidthPanel = styled(motion.div)`
  width: 100%;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transform-origin: center top;
`;

export const ExpandedForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 25px 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

export const ExpandedForecastSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ExpandedForecastHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  
  h4 {
    margin: 0;
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: ${LINE_HEIGHT.tight};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    span {
      opacity: 0.8;
      font-size: ${FONT_SIZE.sm};
      font-weight: ${FONT_WEIGHT.normal};
      margin-left: 8px;
      position: relative;
      top: 1px;
    }
  }
`;

export const DetailGroup = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out, background-color 0.25s ease-out;
  position: relative;
  transform-origin: center bottom;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    
    &::after {
      opacity: 1;
    }
  }
  
  h5 {
    margin: 0;
    font-size: ${FONT_SIZE.sm};
    color: rgba(255, 255, 255, 0.7);
    font-weight: ${FONT_WEIGHT.medium};
    line-height: ${LINE_HEIGHT.normal};
  }
`;

export const DetailValue = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    opacity: 0.8;
  }
  
  span.unit {
    font-size: ${FONT_SIZE.md};
    opacity: 0.7;
    font-weight: ${FONT_WEIGHT.regular};
  }
`;

export const HourlySnippet = styled(motion.div)`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 15px 20px 20px 20px;
  scrollbar-width: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

export const HourlySnippetItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 8px;
  position: relative;
  transition: transform 0.25s ease-out, background-color 0.25s ease-out, box-shadow 0.25s ease-out;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.03);
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    
    &::after {
      opacity: 1;
    }
    
    .time {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .temp {
      transform: scale(1.05);
    }
    
    .icon {
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
    }
  }
  
  .time {
    font-size: ${FONT_SIZE.sm};
    font-weight: ${FONT_WEIGHT.medium};
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.25s ease;
  }
  
  .temp {
    font-size: ${FONT_SIZE.base};
    font-weight: ${FONT_WEIGHT.semibold};
    color: #FFFFFF;
    transition: transform 0.25s ease;
  }
  
  .icon {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.25s ease;
  }
`;

export const AstroInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const CloseButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

export const InfoIcon = styled.div.attrs({ tabIndex: 0 })`
  position: relative;
  color: rgba(255, 255, 255, 0.7);
  cursor: help;
  display: inline-flex;
  font-size: 0.9rem;
  z-index: 100;
  
  &:hover, &:focus {
    color: rgba(255, 255, 255, 0.9);
    outline: none;
  }
`;

export const Tooltip = styled.div`
  position: fixed;
  top: auto;
  bottom: auto;
  left: auto;
  right: auto;
  transform: translateY(-100%);
  margin-top: -15px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  width: 250px;
  z-index: 9999;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
  pointer-events: none;
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    right: 15px;
    border-width: 6px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
  }
  
  @media (max-width: 768px) {
    width: 220px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
  }
`;

export const TooltipTitle = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
  text-align: center;
`;

export const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TooltipItem = styled.div`
  font-size: 0.75rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    font-size: 1.1rem;
  }
`; 