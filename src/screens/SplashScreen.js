import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        style={styles.gradientBackground}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💰</Text>
        </View>
        <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
        <Text style={styles.tagline}>Manage your cash flow with ease</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 60,
  },
  appName: {
    fontSize: TYPOGRAPHY.FONT_SIZE['4XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
});

export default SplashScreen;
