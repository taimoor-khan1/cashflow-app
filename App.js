/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
import { COLORS } from './src/constants';
import { StatusBar } from 'react-native';

const App = () => {
  useEffect( () => {
    LogBox.ignoreAllLogs();
  }, [] );
  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={COLORS.WHITE}
        translucent={false}
        barStyle="dark-content"
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
