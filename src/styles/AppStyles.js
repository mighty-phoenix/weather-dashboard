import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, LINE_HEIGHT } from './TypographyStyles';

// Global style to handle text colors throughout the app
export const GlobalTextColor = createGlobalStyle`
  .weather-dashboard {
    --text-primary: ${props => props.colors.primary};
    --text-secondary: ${props => props.colors.secondary};
    --text-tertiary: ${props => props.colors.tertiary};
    --text-shadow: ${props => props.colors.shadow};
  }
`;

// Styled Components
export const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  padding-top: 160px; /* Space for the sticky search bar */
  position: relative;
  overflow: hidden;
`;

export const WeatherDashboard = styled.div`
  width: 100%;
  max-width: 900px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  color: var(--text-primary, #fff);
  margin: 0 auto;
  transform-origin: top center;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
  }
`;

export const SearchContainer = styled.form`
  display: flex;
  margin-bottom: 0;
  gap: 14px;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  padding: 6px 0;
  
  @media (max-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 15px 24px;
  border: none;
  border-radius: 50px;
  font-size: ${FONT_SIZE.base};
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
  text-indent: 2px;

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35), 
                0 0 0 2px rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(0, 255, 163, 0.2),
                0 0 0 4px rgba(220, 31, 255, 0.1);
    letter-spacing: 0.6px;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.5px;
  }
  
  &.focused {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 
                0 0 0 2px rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(0, 255, 163, 0.2),
                0 0 0 4px rgba(220, 31, 255, 0.1);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    min-width: 160px;
    flex: 1 0 auto;
    padding: 15px 18px;
  }
`;

export const SearchButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: ${FONT_SIZE.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  touch-action: manipulation;
  margin: 0 2px;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle at top right, #00FFA3, #DC1FFF);
    border-radius: 50%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    margin: 0;
  }
`;

export const LocationButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: ${FONT_SIZE.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  touch-action: manipulation;
  margin: 0 2px;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle at bottom left, #36D1DC, #5B86E5);
    border-radius: 50%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    margin: 0;
  }
`;

export const UnitToggle = styled(motion.button)`
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: ${FONT_SIZE.base};
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  touch-action: manipulation;
  letter-spacing: 0.5px;
  margin: 0 2px;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(ellipse at top, #FF512F, #DD2476);
    border-radius: 50px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    height: 40px;
    padding: 4px 10px;
    font-size: ${FONT_SIZE.sm};
    flex-shrink: 0;
    margin: 0;
    gap: 4px;
  }
`;

export const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  p {
    color: var(--text-primary, #fff);
    margin-top: 20px;
    font-size: ${FONT_SIZE.md};
    line-height: ${LINE_HEIGHT.normal};
  }
`;

export const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled(motion.div)`
  color: #fff;
  background: rgba(244, 67, 54, 0.25);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin: 40px 0;
  font-size: ${FONT_SIZE.md};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(244, 67, 54, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  line-height: ${LINE_HEIGHT.normal};
`;

export const Attribution = styled.div`
  margin-top: 20px;
  color: var(--text-tertiary, rgba(255, 255, 255, 0.7));
  font-size: ${FONT_SIZE.xs};
  line-height: ${LINE_HEIGHT.normal};
  
  a {
    color: var(--text-secondary, rgba(255, 255, 255, 0.9));
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`; 