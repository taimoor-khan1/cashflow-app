import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      
      <View style={styles.content}>
        <Text style={styles.logo}>💰</Text>
        <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
        <Text style={styles.tagline}>Manage your cash flow with ease</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.LG,
  },
  appName: {
    fontSize: TYPOGRAPHY.FONT_SIZE['4XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.MD,
  },
  tagline: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.WHITE,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default SplashScreen;
