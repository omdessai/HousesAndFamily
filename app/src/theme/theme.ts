import { MD3LightTheme } from 'react-native-paper';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#5E35B1', // Deep Purple 600
        onPrimary: '#FFFFFF',
        primaryContainer: '#D1C4E9', // Deep Purple 100
        onPrimaryContainer: '#311B92', // Deep Purple 900
        secondary: '#00897B', // Teal 600
        onSecondary: '#FFFFFF',
        secondaryContainer: '#B2DFDB', // Teal 100
        onSecondaryContainer: '#004D40', // Teal 900
        background: '#F5F5F5', // Grey 100
        surface: '#FFFFFF',
        surfaceVariant: '#EEEEEE',
        onSurface: '#212121',
        error: '#B00020',
        elevation: {
            level0: 'transparent',
            level1: '#FFFFFF',
            level2: '#F5F5F5',
            level3: '#EEEEEE',
            level4: '#E0E0E0',
            level5: '#BDBDBD',
        },
    },
    roundness: 12,
};
