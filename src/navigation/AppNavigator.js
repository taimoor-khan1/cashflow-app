import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREENS, COLORS, TYPOGRAPHY } from '../constants';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_TERTIARY,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 5,
          height: 80,
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
        name={SCREENS.PERSONS_LIST}
        component={PersonsListScreen}
        options={{
          tabBarLabel: 'People',
          tabBarIcon: ({ color, size }) => (
            <Icon name="people" size={size} color={color} />
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
      <Stack.Screen name={SCREENS.SIGNUP} component={SignUpScreen} />
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
        name={SCREENS.ADD_PERSON} 
        component={AddPersonScreen}
        options={{ title: 'Add Person' }}
      />
      <Stack.Screen 
        name={SCREENS.EDIT_PERSON} 
        component={EditPersonScreen}
        options={{ title: 'Edit Person' }}
      />
      <Stack.Screen 
        name={SCREENS.PERSON_DETAIL} 
        component={PersonDetailScreen}
        options={{ title: 'Person Details' }}
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
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, start with login screen
      setIsAuthenticated(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const authValue = {
    isAuthenticated,
    login,
    logout,
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer>
        {isAuthenticated ? (
          <MainStackNavigator />
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default AppNavigator;
