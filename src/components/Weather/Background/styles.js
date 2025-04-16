import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background 2s ease-in-out;
  overflow: hidden;
`;

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: overlay;
  transition: background 2s ease-in-out;
`;

export const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.visible ? (props.opacity || 1) : 0};
  transition: opacity 2s ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(white 1px, transparent 1px), 
                      radial-gradient(white 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: 0 0, 25px 25px;
    animation: twinkle 5s ease-in-out infinite alternate;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(white 1px, transparent 1px), 
                      radial-gradient(white 0.5px, transparent 0.5px);
    background-size: 100px 100px;
    background-position: 10px 10px, 55px 55px;
    animation: twinkle 7s ease-in-out infinite alternate;
    animation-delay: 1s;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

export const Sun = styled(motion.div)`
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,200,0,0.8) 50%, rgba(255,150,0,0) 100%);
  border-radius: 50%;
  box-shadow: 0 0 80px rgba(255, 200, 0, 0.8);
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: ${props => props.opacity || 1};
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,200,0,0) 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 5s infinite alternate;
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
  }
`;

export const Moon = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,200,220,0.8) 50%, rgba(150,150,180,0) 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: ${props => props.opacity || 1};
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 20%;
    height: 20%;
    background: rgba(200, 200, 220, 0.8);
    border-radius: 50%;
    box-shadow: 30px 10px 0 -5px rgba(200, 200, 220, 0.8),
                60px 30px 0 -5px rgba(200, 200, 220, 0.8),
                30px 50px 0 -5px rgba(200, 200, 220, 0.8);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,220,0) 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: moonGlow 6s infinite alternate;
  }
  
  @keyframes moonGlow {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
  }
`;

export const CloudsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const Cloud = styled(motion.div)`
  position: absolute;
  width: ${props => 200 * (props.size || 1)}px;
  height: ${props => 80 * (props.size || 1)}px;
  background: ${props => props.dark ? 'rgba(70, 70, 90, 0.90)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 50px;
  box-shadow: 0 0 40px ${props => props.dark ? 'rgba(50, 50, 70, 0.7)' : 'rgba(255, 255, 255, 0.5)'};
  filter: ${props => props.dark ? 'brightness(0.8)' : 'none'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${props => props.dark ? 'rgba(95, 95, 120, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
    border-radius: 50%;
  }
  
  &::before {
    width: ${props => 100 * (props.size || 1)}px;
    height: ${props => 100 * (props.size || 1)}px;
    top: ${props => -50 * (props.size || 1)}px;
    left: ${props => 30 * (props.size || 1)}px;
  }
  
  &::after {
    width: ${props => 120 * (props.size || 1)}px;
    height: ${props => 120 * (props.size || 1)}px;
    top: ${props => -60 * (props.size || 1)}px;
    right: ${props => 30 * (props.size || 1)}px;
  }
  
  animation: float ${props => 80 + props.delay}s linear infinite;
  opacity: ${() => 0.8 + Math.random() * 0.2};
  
  @keyframes float {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 300px)); }
  }
`;

export const RainContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
`;

export const RainLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 3;
  
  &.background {
    z-index: 2;
  }
  
  &.middle {
    z-index: 3;
  }
  
  &.foreground {
    z-index: 4;
  }
  
  &.heavy {
    filter: blur(0.4px);
  }
`;

export const HeavyRainContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 4;
`;

export const SnowContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
`;

export const Snow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const SnowCloudGroup = styled.div`
  position: absolute;
  height: 400px;
  overflow: visible;
  z-index: 3;
`;

export const Snowflake = styled(motion.div)`
  position: absolute;
  width: ${props => 10 * (props.size || 1)}px;
  height: ${props => 10 * (props.size || 1)}px;
  background: white;
  border-radius: 50%;
  top: 0;
  opacity: 0.8;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: snow ${() => 15 + Math.random() * 10}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1;
  transform-origin: center;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
  
  &::before {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: rotate(45deg);
  }
  
  &::after {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: rotate(90deg);
  }
  
  @keyframes snow {
    0% { 
      transform: translateY(0) rotate(0deg) translateX(0); 
      opacity: 0; 
    }
    10% {
      opacity: 0.8;
      transform: translateY(10px) rotate(30deg) translateX(${props => props.sway ? props.sway : 15}px);
    }
    50% {
      transform: translateY(150px) rotate(180deg) translateX(-${props => props.sway ? props.sway : 15}px);
    }
    90% {
      opacity: 0.6;
    }
    100% { 
      transform: translateY(300px) rotate(360deg) translateX(${props => props.sway ? props.sway : 15}px); 
      opacity: 0; 
    }
  }
  
  &.blizzard {
    animation: blizzardSnow ${() => 8 + Math.random() * 6}s linear infinite;
    
    @keyframes blizzardSnow {
      0% { 
        transform: translateY(0) rotate(0deg) translateX(0); 
        opacity: 0; 
      }
      10% {
        opacity: 0.8;
        transform: translateY(10px) rotate(30deg) translateX(35px);
      }
      50% {
        transform: translateY(150px) rotate(180deg) translateX(-25px);
      }
      90% {
        opacity: 0.6;
      }
      100% { 
        transform: translateY(300px) rotate(360deg) translateX(30px); 
        opacity: 0; 
      }
    }
  }
  
  &.heavy {
    animation: heavySnow ${() => 10 + Math.random() * 5}s linear infinite;
    
    @keyframes heavySnow {
      0% { 
        transform: translateY(0) rotate(0deg) translateX(0); 
        opacity: 0; 
      }
      10% {
        opacity: 0.9;
        transform: translateY(20px) rotate(30deg) translateX(20px);
      }
      90% {
        opacity: 0.7;
      }
      100% { 
        transform: translateY(300px) rotate(360deg) translateX(-20px); 
        opacity: 0; 
      }
    }
  }
  
  &.ice-pellets {
    box-shadow: 0 0 3px rgba(200, 225, 255, 0.9);
    animation: icePellets ${() => 6 + Math.random() * 4}s linear infinite;
    
    @keyframes icePellets {
      0% { 
        transform: translateY(0); 
        opacity: 0; 
      }
      10% {
        opacity: 0.9;
        transform: translateY(30px) translateX(5px);
      }
      90% {
        opacity: 0.7;
      }
      100% { 
        transform: translateY(300px) translateX(-5px); 
        opacity: 0; 
      }
    }
  }
`;

export const ThunderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 2;
  animation: thunderOverlayAnimation 7s infinite;
  pointer-events: none;
  
  @keyframes thunderOverlayAnimation {
    0%, 93%, 96%, 98%, 100% {
      background: transparent;
    }
    94%, 95%, 97% {
      background: rgba(120, 170, 255, 0.05);
    }
    95.5% {
      background: rgba(180, 215, 255, 0.1);
    }
  }
`;

export const ThunderLightning = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: #fff;
    box-shadow: 0 0 30px rgba(255, 255, 255, 1), 
                0 0 60px rgba(255, 252, 205, 0.8), 
                0 0 100px rgba(255, 247, 168, 0.6);
    opacity: 0;
    z-index: 5;
    clip-path: polygon(
      50% 0%, 
      45% 30%, 
      60% 35%, 
      40% 60%, 
      55% 65%, 
      30% 100%, 
      45% 60%, 
      25% 55%, 
      50% 30%, 
      35% 25%
    );
    animation: primaryLightning 7s infinite;
  }
  
  /* Primary lightning bolt */
  &::before {
    top: 5%;
    left: 30%;
    width: 5px;
    height: 0;
    transform-origin: top;
    transform: rotate(-10deg) scaleY(0);
    animation: primaryLightning 7s infinite;
  }
  
  /* Secondary lightning bolt */
  &::after {
    top: 10%;
    left: 60%;
    width: 5px;
    height: 0;
    transform-origin: top;
    transform: rotate(10deg) scaleY(0);
    animation: secondaryLightning 7s infinite;
  }
  
  @keyframes primaryLightning {
    0%, 93.5%, 100% {
      opacity: 0;
      height: 0;
      transform: rotate(-10deg) scaleY(0);
    }
    94%, 94.5% {
      opacity: ${props => props.intensity || 0.8};
      height: 60vh;
      transform: rotate(-10deg) scaleY(1);
    }
    94.6%, 94.9% {
      opacity: 0;
      height: 60vh;
      transform: rotate(-10deg) scaleY(1);
    }
  }
  
  @keyframes secondaryLightning {
    0%, 94.9%, 100% {
      opacity: 0;
      height: 0;
      transform: rotate(10deg) scaleY(0);
    }
    95.2%, 95.7% {
      opacity: ${props => props.intensity || 0.8};
      height: 70vh;
      transform: rotate(10deg) scaleY(1);
    }
    95.8%, 96.1% {
      opacity: 0;
      height: 70vh;
      transform: rotate(10deg) scaleY(1);
    }
  }
  
  @keyframes tertiaryLightning {
    0%, 96.9%, 100% {
      opacity: 0;
      height: 0;
      transform: rotate(5deg) scaleY(0);
    }
    97.2%, 97.7% {
      opacity: ${props => props.intensity || 0.8};
      height: 50vh;
      transform: rotate(5deg) scaleY(1);
    }
    97.8%, 98.1% {
      opacity: 0;
      height: 50vh;
      transform: rotate(5deg) scaleY(1);
    }
  }
  
  &.intense::before,
  &.intense::after {
    box-shadow: 0 0 40px rgba(255, 255, 255, 1), 
                0 0 80px rgba(255, 252, 205, 0.9), 
                0 0 120px rgba(255, 247, 168, 0.7);
  }
`;

export const BackgroundDarken = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 15, 35, 0.4);
  z-index: 1;
`;

export const RainOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0, 0, 20, 0.3) 0%, rgba(0, 0, 20, 0) 100%);
  z-index: 5;
  pointer-events: none;
  opacity: 0.2;
`;

export const HeavyRainOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom,
    rgba(200, 230, 255, 0) 0%,
    rgba(200, 230, 255, 0.03) 40%,
    rgba(200, 230, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 5;
`;

export const ElegantRainDrop = styled.div`
  position: absolute;
  width: 1px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.7));
  border-radius: 0;
  top: -50px;
  animation: elegantRain 2.5s linear infinite;
  
  @keyframes elegantRain {
    0% { transform: translateY(-100px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0.5; }
  }
`;

export const ElegantHeavyRainDrop = styled.div`
  position: absolute;
  background: linear-gradient(to bottom, 
    rgba(220, 240, 255, 0.1) 0%, 
    rgba(240, 250, 255, 0.9) 30%, 
    rgba(240, 250, 255, 0.4) 100%
  );
  top: -150px;
  animation: elegantHeavyRain linear infinite;
  box-shadow: 0 0 2px rgba(200, 230, 255, 0.2);
  will-change: transform;
  
  @keyframes elegantHeavyRain {
    0% {
      transform: translateY(-150px);
      animation-timing-function: ease-in;
    }
    40% {
      animation-timing-function: linear;
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;

export const Fog = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const FogContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  
  &.freezing {
    filter: saturate(0.8) brightness(0.9);
  }
`;

export const FogLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const FogElement = styled(motion.div)`
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 40px 20px white;
`;

export const LightningFlash = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 10;
  pointer-events: none;
  animation: lightningFlashEffect 7s infinite;
  mix-blend-mode: screen;
  
  @keyframes lightningFlashEffect {
    0%, 42.4%, 43.6%, 94.4%, 95.6%, 96.4%, 97.6%, 100% { 
      background: transparent; 
    }
    42.5%, 43.5% { 
      background: rgba(200, 230, 255, 0.2);
    }
    95.5% { 
      background: rgba(220, 240, 255, 0.35);
    }
    96.5%, 97.5% { 
      background: rgba(180, 215, 255, 0.25);
    }
  }
`; 