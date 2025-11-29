import React from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';

import { theme } from './src/theme/theme';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;

