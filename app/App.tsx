import React from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

import { theme } from './src/theme/theme';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
