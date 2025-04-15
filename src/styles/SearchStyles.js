import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, LINE_HEIGHT } from './TypographyStyles';

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
  
  /* Add a threshold for tap events to distinguish from scrolling */
  user-select: none;
  -webkit-user-select: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(0);
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
`;

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