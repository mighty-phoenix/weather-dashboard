import React, { useMemo } from 'react';
import { 
  CloudsContainer, 
  Cloud, 
  FogContainer, 
  FogLayer,
  FogElement 
} from '../styles';

const Fog = ({ weatherCode, isDay }) => {
  // Determine fog characteristics based on weather code
  const fogConfig = useMemo(() => {
    // Mist (1030)
    if (weatherCode === 1030) {
      return {
        fogLayers: 2,
        elementsPerLayer: 4,
        opacity: {
          base: isDay ? 0.4 : 0.5,
          variation: 0.2
        },
        speed: {
          base: 120,
          variation: 20
        },
        size: {
          min: 50,
          max: 75
        },
        blur: {
          min: 8,
          max: 12
        }
      };
    }
    // Fog (1135)
    else if (weatherCode === 1135) {
      return {
        fogLayers: 3,
        elementsPerLayer: 5,
        opacity: {
          base: isDay ? 0.6 : 0.7,
          variation: 0.2
        },
        speed: {
          base: 140,
          variation: 30
        },
        size: {
          min: 55,
          max: 85
        },
        blur: {
          min: 10,
          max: 18
        }
      };
    }
    // Freezing fog (1147)
    else if (weatherCode === 1147) {
      return {
        fogLayers: 3,
        elementsPerLayer: 5,
        opacity: {
          base: isDay ? 0.7 : 0.8,
          variation: 0.15
        },
        speed: {
          base: 100,
          variation: 25
        },
        size: {
          min: 60,
          max: 90
        },
        blur: {
          min: 12,
          max: 20
        }
      };
    }
    // Default fog configuration
    return {
      fogLayers: 3,
      elementsPerLayer: 4,
      opacity: {
        base: isDay ? 0.5 : 0.6,
        variation: 0.2
      },
      speed: {
        base: 120,
        variation: 25
      },
      size: {
        min: 55,
        max: 85
      },
      blur: {
        min: 10,
        max: 18
      }
    };
  }, [weatherCode, isDay]);

  // Generate fog elements
  const fogElements = useMemo(() => {
    const seed = weatherCode * 100 + (isDay ? 1 : 0);
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    const layers = [];
    
    for (let layer = 0; layer < fogConfig.fogLayers; layer++) {
      const elements = [];
      const layerOpacity = fogConfig.opacity.base - (layer * (fogConfig.opacity.variation / fogConfig.fogLayers));
      const zIndex = 10 - layer; // Higher layers are closer to the viewer
      
      for (let i = 0; i < fogConfig.elementsPerLayer; i++) {
        const randomVal = seedRandom(layer * 100 + i);
        const randomVal2 = seedRandom(layer * 100 + i + 50);
        const randomSpeed = fogConfig.speed.base + (randomVal * fogConfig.speed.variation);
        
        // Determine size - larger elements in front layers
        const size = fogConfig.size.min + 
                     ((fogConfig.size.max - fogConfig.size.min) * 
                      (layer / fogConfig.fogLayers) + 
                      randomVal * ((fogConfig.size.max - fogConfig.size.min) / 3));
        
        // Position vertically based on layer with some randomness
        const verticalPosition = (layer * (100 / fogConfig.fogLayers)) + 
                                 (randomVal2 * (100 / fogConfig.fogLayers) * 0.6);
        
        // Blur based on layer (further = more blur)
        const blurAmount = fogConfig.blur.min + 
                          ((fogConfig.fogLayers - layer - 1) / fogConfig.fogLayers) * 
                          (fogConfig.blur.max - fogConfig.blur.min);
        
        elements.push({
          key: `fog-${layer}-${i}-${weatherCode}`,
          style: {
            left: `${(i * (100 / fogConfig.elementsPerLayer) + randomVal * 15) % 100}%`,
            top: `${verticalPosition}%`,
            opacity: layerOpacity - (randomVal * 0.2),
            width: `${size}%`,
            height: `${size * 0.6}%`,
            filter: `blur(${blurAmount}px)`,
            animationDuration: `${randomSpeed}s`,
            zIndex,
            animationDelay: `${randomVal * 10}s`,
            willChange: 'transform, opacity'
          }
        });
      }
      
      layers.push({
        key: `fog-layer-${layer}-${weatherCode}`,
        elements,
        zIndex
      });
    }
    
    return layers;
  }, [weatherCode, isDay, fogConfig]);

  // Create additional cloud layer for certain fog types
  const shouldAddClouds = weatherCode === 1135 || weatherCode === 1147;
  const cloudElements = useMemo(() => {
    if (!shouldAddClouds) return [];
    
    const seed = weatherCode * 200;
    const seedRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    const cloudCount = weatherCode === 1147 ? 3 : 2;
    
    return [...Array(cloudCount)].map((_, i) => {
      return {
        key: `fog-cloud-${i}-${weatherCode}`,
        delay: i * 3 + seedRandom(i) * 5,
        size: 0.9 + seedRandom(i) * 0.5,
        dark: weatherCode === 1147,
        style: {
          top: `${(i * 30) + seedRandom(i) * 15}%`,
          left: `${seedRandom(i + 50) * 80}%`,
          opacity: 0.7,
          zIndex: 2,
          willChange: 'transform'
        }
      };
    });
  }, [weatherCode, shouldAddClouds]);

  return (
    <>
      {shouldAddClouds && (
        <CloudsContainer>
          {cloudElements.map(cloudProps => (
            <Cloud
              key={cloudProps.key}
              delay={cloudProps.delay}
              size={cloudProps.size}
              dark={cloudProps.dark}
              style={cloudProps.style}
            />
          ))}
        </CloudsContainer>
      )}
      
      <FogContainer className={weatherCode === 1147 ? 'freezing' : ''}>
        {fogElements.map(layer => (
          <FogLayer key={layer.key} style={{ zIndex: layer.zIndex }}>
            {layer.elements.map(element => (
              <FogElement
                key={element.key}
                style={element.style}
                animate={{ 
                  x: ["0%", "100%", "0%"],
                  opacity: [
                    element.style.opacity,
                    element.style.opacity - 0.05,
                    element.style.opacity
                  ]
                }}
                transition={{
                  duration: parseInt(element.style.animationDuration),
                  ease: "linear",
                  repeat: Infinity,
                  delay: parseInt(element.style.animationDelay) || 0,
                  times: [0, 0.5, 1]
                }}
              />
            ))}
          </FogLayer>
        ))}
      </FogContainer>
    </>
  );
};

export default Fog; 