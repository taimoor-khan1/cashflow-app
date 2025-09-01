import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';
import dataService from '../services/dataService';
import { ensureFirebaseInitialized } from '../config/firebase';

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setStatus('Checking Firebase connection...');
      
      // Test Firebase connection
      const firebaseInitialized = ensureFirebaseInitialized();
      if (firebaseInitialized && dataService) {
        setStatus('Firebase connected successfully');
      } else {
        setStatus('Firebase connection failed');
      }
      
      setStatus('Loading app data...');
      
      // Initialize data service if needed
      // This will be handled by AppNavigator when user is authenticated
      
      setStatus('Ready!');
      
      // Add a delay to ensure Firebase is fully initialized
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // The splash screen will automatically disappear when AppNavigator
      // finishes loading and shows the appropriate screen
      
    } catch (error) {
      console.error('Error initializing app:', error);
      setStatus('Error initializing app');
      
      // Continue loading even if there's an error
      // AppNavigator will handle the navigation
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Loading Indicator */}
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color={COLORS.WHITE} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
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
    marginBottom: 48,
  },
  loadingSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  statusText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SplashScreen;
