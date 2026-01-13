export const theme = {
  colors: {
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
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 30,
    xxl: 40,
    xxxl: 60,
  },
  borderRadius: {
    small: 5,
    medium: 10,
    large: 15,
    round: 50,
  },
  fontSize: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
};

export type Theme = typeof theme;
