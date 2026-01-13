// Cores do app
export const colors = {
  primary: '#ff751f',
  secondary: '#5856D6',
  background: '#f9f9f9',
  text: '#333333',
  textSecondary: '#666666',
  border: '#DDDDDD',
  inputBackground: '#F9F9F9',
  error: '#FF3B30',
  success: '#34C759',
  white: '#FFFFFF',
  black: '#000000',
};

// Tamanhos de fonte
export const fontSize = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

// Espaçamentos
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 30,
  xxl: 40,
  xxxl: 60,
};

// Border radius
export const borderRadius = {
  small: 5,
  medium: 10,
  large: 15,
  round: 50,
};

// Font weights
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: 'bold' as const,
};

// Sombras
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

export default {
  colors,
  fontSize,
  spacing,
  borderRadius,
  fontWeight,
  shadows,
};
