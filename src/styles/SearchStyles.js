import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, LINE_HEIGHT } from './TypographyStyles';

// Define animations
const dotPulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Define SearchBarInner first before using it in StickySearchBar
export const SearchBarInner = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
`;

// New sticky top bar components
export const StickySearchBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  /* Scroll behavior for all devices */
  &.scrolled {
    padding: 8px 0;
    background: rgba(0, 0, 0, 0.6);
    
    /* Hide featured locations when scrolled down */
    .FeaturedLocations {
      max-height: 0;
      height: 0;
      opacity: 0;
      margin: 0;
      padding: 0;
      display: none;
      pointer-events: none;
      overflow: hidden;
      transition: none;
    }
    
    ${SearchBarInner} {
      min-height: unset;
    }
  }
  
  /* Additional desktop specific behavior */
  @media (min-width: 768px) {
    &.scrolled {
      padding: 8px 0;
    }
  }

  /* Update SearchBarInner when inside scrolled state */
  &.scrolled ${SearchBarInner} {
    flex-direction: row;
    align-items: center;
  }
`;

export const FeaturedLocations = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
  padding-top: 5px;
  max-height: 60px;
  height: auto;
  transition: all 0.2s ease-out;
  opacity: 1;
  /* Horizontal scroll behavior */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    /* Prevent accidental taps during scroll */
    scroll-snap-type: x proximity;
    padding: 5px 0;
    
    /* Ensure the world icon is always visible by adding padding */
    padding-left: 5px;
    
    /* Add a scroll padding to prevent cutting off the first item */
    scroll-padding-left: 32px;
    
  }
`;

export const LocationChip = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 8px 16px;
  color: white;
  font-size: ${FONT_SIZE.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s ease;
  line-height: ${LINE_HEIGHT.normal};
  margin: 2px 0;
  transform-origin: center center;
  touch-action: manipulation;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  
  /* Add a threshold for tap events to distinguish from scrolling */
  user-select: none;
  -webkit-user-select: none;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle at center, #9D50BB, #6E48AA);
    border-radius: 50px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  /* Custom dynamic gradients based on data-colors attribute */
  &[data-colors] {
    &::before {
      background: ${props => {
        const colors = props['data-colors'];
        if (colors) {
          const values = colors.split(',');
          if (values.length >= 6) {
            return `linear-gradient(to right, 
              rgba(${values[0]}, ${values[1]}, ${values[2]}, 1), 
              rgba(${values[3]}, ${values[4]}, ${values[5]}, 1))`;
          }
        }
        return 'radial-gradient(circle at center, #9D50BB, #6E48AA)';
      }};
    }
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: transparent;
    transform: translateY(-2px);
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    
    &::before {
      opacity: 0.8;
      background-size: 200% 100%;
      animation: ${shimmerEffect} 2s infinite;
    }
  }
  
  &:active {
    background: rgba(0, 0, 0, 0.4);
    border-color: transparent;
    transform: translateY(0);
    
    &::before {
      opacity: 1;
    }
  }
  
  svg {
    font-size: ${FONT_SIZE.base};
  }
  
  @media (max-width: 768px) {
    /* Better mobile touch handling */
    transition: background 0.2s ease; /* Only animate background, not position */
    
    &:active {
      transform: none; /* Don't move on mobile */
    }
  }
`;

export const CurrentTime = styled.div`
  font-size: ${FONT_SIZE.md};
  color: rgba(255, 255, 255, 0.7);
  margin-left: auto;
  padding-right: 10px;
  line-height: ${LINE_HEIGHT.normal};
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0; /* Important for flex item to allow proper shrinking */
  width: 100%;
`;

export const SuggestionsContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    right: 0;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    left: 0;
    right: 0;
    transform: none;
    border-radius: 10px;
    max-height: 50vh;
    position: fixed;
    top: 73px;
  }
`;

export const SuggestionItem = styled(motion.div)`
  padding: 12px 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${FONT_SIZE.base};
  transition: all 0.2s ease;
  line-height: ${LINE_HEIGHT.normal};
  
  span {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .country {
    margin-left: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: ${FONT_SIZE.sm};
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 16px 15px;
    font-size: ${FONT_SIZE.md};
    
    .country {
      font-size: ${FONT_SIZE.xs};
    }
  }
`;

export const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  span {
    animation: ${dotPulse} 1.5s infinite;
    margin: 0 2px;
    font-size: ${FONT_SIZE.xl};
    line-height: 8px;
    
    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.3s;
    }
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
`;

export const ScrollIndicator = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: heartbeat 1.5s infinite;
  
  svg {
    font-size: ${FONT_SIZE.xl};
    color: white;
  }
`; 