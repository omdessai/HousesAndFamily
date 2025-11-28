import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Dashboard from './src/screens/Dashboard';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <Dashboard />
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default App;
