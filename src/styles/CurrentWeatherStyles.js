import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from './TypographyStyles';

export const CurrentWeather = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const LocationInfo = styled.div`
  flex: 1;
  min-width: 250px;

  h1 {
    font-size: ${FONT_SIZE['3xl']};
    margin: 0;
    color: var(--text-primary, #fff);
    text-shadow: var(--text-shadow, 0 2px 10px rgba(0, 0, 0, 0.3));
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.bold};
    
    @media (max-width: 768px) {
      font-size: ${FONT_SIZE['2xl']};
    }
  }

  h2 {
    font-size: ${FONT_SIZE.md};
    margin: 0;
    color: var(--text-secondary, rgba(255, 255, 255, 0.8));
    font-weight: ${FONT_WEIGHT.regular};
    margin-top: 5px;
    line-height: ${LINE_HEIGHT.normal};
  }

  p {
    color: var(--text-tertiary, rgba(255, 255, 255, 0.7));
    margin-top: 15px;
    font-size: ${FONT_SIZE.sm};
    line-height: ${LINE_HEIGHT.normal};
  }
`;

export const WeatherInfo = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

export const TemperatureDisplay = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const IconContainer = styled.div`
  margin-right: 10px;
`;

export const Temperature = styled.div`
  font-size: ${FONT_SIZE['4xl']};
  font-weight: ${FONT_WEIGHT.bold};
  color: var(--text-primary, #fff);
  text-shadow: var(--text-shadow, 0 2px 10px rgba(0, 0, 0, 0.3));
  line-height: ${LINE_HEIGHT.tight};
  
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE['3xl']};
  }
`;

export const WeatherCondition = styled.div`
  font-size: ${FONT_SIZE.xl};
  color: var(--text-primary, #fff);
  text-align: right;
  margin-top: 5px;
  text-shadow: var(--text-shadow, 0 2px 10px rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  line-height: ${LINE_HEIGHT.tight};
  font-weight: ${FONT_WEIGHT.medium};
  
  .thunder-indicator {
    font-size: ${FONT_SIZE.lg};
  }
  
  @media (max-width: 768px) {
    text-align: center;
    justify-content: center;
  }
`;

export const WeatherDetails = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary, rgba(255, 255, 255, 0.9));

  span:first-child {
    font-size: ${FONT_SIZE.md};
    color: var(--text-tertiary, rgba(255, 255, 255, 0.7));
    margin-bottom: 5px;
    line-height: ${LINE_HEIGHT.normal};
    font-weight: ${FONT_WEIGHT.medium};
  }

  span:last-child {
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
    line-height: ${LINE_HEIGHT.normal};
  }
`; 