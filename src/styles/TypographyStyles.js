// Typography constants for consistent text sizing
import { createGlobalStyle } from 'styled-components';

// Font scale based on a type ratio of 1.2 (minor third)
export const FONT_SIZE = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  md: '1.125rem',    // 18px
  lg: '1.25rem',     // 20px
  xl: '1.5rem',      // 24px
  '2xl': '1.875rem', // 30px
  '3xl': '2.25rem',  // 36px
  '4xl': '3rem',     // 48px
};

// Line heights
export const LINE_HEIGHT = {
  tight: '1.2',    // Headings
  normal: '1.5',   // Body text
  relaxed: '1.75', // More spaced text
};

// Font weights
export const FONT_WEIGHT = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Global typography styles
export const GlobalTypography = createGlobalStyle`
  html {
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-size: ${FONT_SIZE.base};
    line-height: ${LINE_HEIGHT.normal};
    font-weight: ${FONT_WEIGHT.regular};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1 {
    font-size: ${FONT_SIZE['3xl']};
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.bold};
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: ${FONT_SIZE['2xl']};
    }
  }

  h2 {
    font-size: ${FONT_SIZE.xl};
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: ${FONT_SIZE.lg};
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: ${FONT_SIZE.md};
    line-height: ${LINE_HEIGHT.tight};
    font-weight: ${FONT_WEIGHT.medium};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: ${FONT_SIZE.base};
    line-height: ${LINE_HEIGHT.normal};
    margin-bottom: 1rem;
  }

  small {
    font-size: ${FONT_SIZE.sm};
    line-height: ${LINE_HEIGHT.normal};
  }
`; 