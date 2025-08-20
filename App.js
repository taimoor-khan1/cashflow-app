/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView } from 'react-native';
import { COLORS } from './src/constants';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
          backgroundColor={COLORS.WHITE}
          translucent={false}
          barStyle="dark-content"
        />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
