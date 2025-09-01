import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';
import { auth, database } from '../config/firebase';
import authService from '../services/authService';
import dataService from '../services/dataService';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Firebase Connection
      results.connection = await testFirebaseConnection();
      
      // Test 2: Authentication Service
      results.auth = await testAuthService();
      
      // Test 3: Database Service
      results.database = await testDatabaseService();
      
      // Test 4: Real-time Listeners
      results.listeners = await testRealTimeListeners();
      
    } catch (error) {
      console.error('Test suite error:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testFirebaseConnection = async () => {
    try {
      // Test if Firebase is initialized
      const app = auth().app;
      if (!app) {
        throw new Error('Firebase app not initialized');
      }

      // Test database connection
      const testRef = database().ref('test');
      await testRef.set({ timestamp: Date.now() });
      await testRef.remove();

      return { status: 'PASS', message: 'Firebase connection successful' };
    } catch (error) {
      return { status: 'FAIL', message: `Connection failed: ${error.message}` };
    }
  };

  const testAuthService = async () => {
    try {
      // Test auth service methods
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      return { 
        status: 'PASS', 
        message: `Auth service working. Authenticated: ${isAuth}, User: ${currentUser ? 'Yes' : 'No'}` 
      };
    } catch (error) {
      return { status: 'FAIL', message: `Auth service failed: ${error.message}` };
    }
  };

  const testDatabaseService = async () => {
    try {
      // Test if data service can be initialized
      const testUserId = 'test-user-123';
      dataService.init(testUserId);
      
      // Test basic operations
      const persons = await dataService.getPersons();
      const transactions = await dataService.getTransactions();
      
      return { 
        status: 'PASS', 
        message: `Database service working. Persons: ${persons.length}, Transactions: ${transactions.length}` 
      };
    } catch (error) {
      return { status: 'FAIL', message: `Database service failed: ${error.message}` };
    }
  };

  const testRealTimeListeners = async () => {
    try {
      const testUserId = 'test-user-123';
      dataService.init(testUserId);
      
      // Test setting up listeners
      const personsListener = dataService.listenToPersons(() => {});
      const transactionsListener = dataService.listenToTransactions(() => {});
      
      // Clean up
      dataService.removePersonsListener();
      dataService.removeTransactionsListener();
      
      return { status: 'PASS', message: 'Real-time listeners working' };
    } catch (error) {
      return { status: 'FAIL', message: `Listeners failed: ${error.message}` };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return COLORS.SUCCESS;
      case 'FAIL': return COLORS.ERROR;
      default: return COLORS.WARNING;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return '✅';
      case 'FAIL': return '❌';
      default: return '⚠️';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Firebase Integration Test</Text>
        <Text style={styles.subtitle}>Verify all Firebase services are working correctly</Text>
      </View>

      <TouchableOpacity
        style={[styles.runButton, isRunning && styles.runButtonDisabled]}
        onPress={runAllTests}
        disabled={isRunning}
      >
        <Text style={styles.runButtonText}>
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Text>
      </TouchableOpacity>

      {Object.keys(testResults).length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results</Text>
          
          {Object.entries(testResults).map(([testName, result]) => (
            <View key={testName} style={styles.testResult}>
              <View style={styles.testHeader}>
                <Text style={styles.testName}>{testName.toUpperCase()}</Text>
                <Text style={[styles.testStatus, { color: getStatusColor(result.status) }]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
              <Text style={styles.testMessage}>{result.message}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What These Tests Check:</Text>
        <Text style={styles.infoText}>• Firebase app initialization</Text>
        <Text style={styles.infoText}>• Database connection</Text>
        <Text style={styles.infoText}>• Authentication service</Text>
        <Text style={styles.infoText}>• Data service operations</Text>
        <Text style={styles.infoText}>• Real-time listeners</Text>
      </View>

      <View style={styles.warningContainer}>
        <Text style={styles.warningTitle}>⚠️ Important Notes:</Text>
        <Text style={styles.warningText}>• Make sure Firebase project is configured</Text>
        <Text style={styles.warningText}>• Update web client ID in firebase.js</Text>
        <Text style={styles.warningText}>• Check internet connection</Text>
        <Text style={styles.warningText}>• Verify Android/iOS configuration</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  runButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.XL,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  runButtonDisabled: {
    backgroundColor: COLORS.GRAY_400,
  },
  runButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  resultsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  resultsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LG,
  },
  testResult: {
    marginBottom: SPACING.LG,
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 8,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  testName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  testStatus: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  testMessage: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.INFO_LIGHT,
    borderRadius: 16,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.INFO,
    marginBottom: SPACING.MD,
  },
  infoText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  warningContainer: {
    backgroundColor: COLORS.WARNING_LIGHT,
    borderRadius: 16,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  warningTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.WARNING,
    marginBottom: SPACING.MD,
  },
  warningText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
});

export default FirebaseTest;

