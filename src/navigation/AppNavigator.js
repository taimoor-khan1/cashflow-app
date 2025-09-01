import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Firebase configuration first to ensure initialization
import '../config/firebase';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREENS, COLORS, TYPOGRAPHY } from '../constants';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PersonsListScreen from '../screens/PersonsListScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPersonScreen from '../screens/AddPersonScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import EditPersonScreen from '../screens/EditPersonScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import TransactionsListScreen from '../screens/TransactionsListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import services
import authService from '../services/authService';
import dataService from '../services/dataService';

// Import context providers
import { ToastProvider } from '../contexts/ToastContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_TERTIARY,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 20),
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom, 20),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={SCREENS.DASHBOARD}
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.ACCOUNTS_LIST}
        component={PersonsListScreen}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-balance" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.TRANSACTIONS_LIST}
        component={TransactionsListScreen}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt-long" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.REPORTS}
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.BACKGROUND },
      }}
    >
      <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Main App Stack Navigator
const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.WHITE,
          borderBottomColor: COLORS.BORDER,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
          fontSize: TYPOGRAPHY.FONT_SIZE.LG,
        },
        cardStyle: { backgroundColor: COLORS.BACKGROUND },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_ACCOUNT} 
        component={AddPersonScreen}
        options={{ title: 'Add Account' }}
      />
      <Stack.Screen 
        name={SCREENS.EDIT_ACCOUNT} 
        component={EditPersonScreen}
        options={{ title: 'Edit Account' }}
      />
      <Stack.Screen 
        name={SCREENS.ACCOUNT_DETAIL} 
        component={PersonDetailScreen}
        options={{ title: 'Account Details' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_TRANSACTION} 
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction' }}
      />
      <Stack.Screen 
        name={SCREENS.TRANSACTION_DETAIL} 
        component={TransactionDetailScreen}
        options={{ title: 'Transaction Details' }}
      />
      <Stack.Screen 
        name={SCREENS.EDIT_PROFILE} 
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name={SCREENS.SETTINGS} 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name={SCREENS.CATEGORY_MANAGEMENT} 
        component={CategoryManagementScreen}
        options={{ title: 'Manage Categories' }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      dataService.cleanup();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Initialize Firebase auth state listener
    const unsubscribe = authService.initAuthStateListener((user) => {
      console.log('Auth state changed - user:', user);
      if (user) {
        console.log('User authenticated, initializing data service with UID:', user.uid);
        setIsAuthenticated(true);
        setCurrentUser(user);
        // Initialize data service with user ID
        try {
          dataService.init(user.uid);
          console.log('Data service initialized successfully');
        } catch (error) {
          console.error('Failed to initialize data service:', error);
        }
      } else {
        console.log('User not authenticated, cleaning up data service');
        setIsAuthenticated(false);
        setCurrentUser(null);
        dataService.cleanup();
      }
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
      dataService.cleanup();
    };
  }, []);

  const authValue = {
    isAuthenticated,
    currentUser,
    login,
    logout,
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authValue}>
      <ToastProvider>
        <NavigationContainer>
          {isAuthenticated ? (
            <MainStackNavigator />
          ) : (
            <AuthStackNavigator />
          )}
        </NavigationContainer>
      </ToastProvider>
    </AuthContext.Provider>
  );
};

export default AppNavigator;
