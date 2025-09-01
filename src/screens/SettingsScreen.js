import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';

import { useAuth } from '../navigation/AppNavigator';
import dataService from '../services/dataService';

const SettingsScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    currency: 'PKR',
  });
  const [loading, setLoading] = useState(false);

  const handleSettingToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Change Currency',
      'Select your preferred currency',
      [
        { text: 'PKR', onPress: () => setSettings(prev => ({ ...prev, currency: 'PKR' })) },
        { text: 'USD', onPress: () => setSettings(prev => ({ ...prev, currency: 'USD' })) },
        { text: 'EUR', onPress: () => setSettings(prev => ({ ...prev, currency: 'EUR' })) },
        { text: 'GBP', onPress: () => setSettings(prev => ({ ...prev, currency: 'GBP' })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };



  const handleExportData = async () => {
    try {
      setLoading(true);
      
      // Get all data from Firebase
      const accounts = await dataService.getPersons();
      const transactions = await dataService.getTransactions();
      
      // Show summary of data
      Alert.alert(
        'Data Summary',
        `You have ${accounts.length} accounts and ${transactions.length} transactions.\n\nData is automatically backed up to your account.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error getting data:', error);
      Alert.alert('Error', 'Failed to retrieve data. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Get all data to delete
              const accounts = await dataService.getPersons();
              const transactions = await dataService.getTransactions();
              
              // Delete all transactions first
              for (const transaction of transactions) {
                await dataService.deleteTransaction(transaction.id);
              }
              
              // Delete all accounts
              for (const account of accounts) {
                await dataService.deletePerson(account.id);
              }
              
              Alert.alert('Data Cleared', 'All your data has been permanently deleted.');
              
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, value, onPress, type = 'toggle' }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={COLORS.PRIMARY} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY }}
          thumbColor={COLORS.WHITE}
        />
      ) : (
        <View style={styles.settingRight}>
          <Text style={styles.settingValue}>{value}</Text>
          <Icon name="chevron-right" size={24} color={COLORS.TEXT_TERTIARY} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your app experience</Text>
        </View>

        {/* Preferences */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive reminders and updates"
            value={settings.notifications}
            onPress={() => handleSettingToggle('notifications')}
          />
        </Card>

        {/* Categories */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <SettingItem
            icon="category"
            title="Manage Categories"
            subtitle="Add, edit, and organize transaction categories"
            value=""
            onPress={() => navigation.navigate('CategoryManagement')}
            type="action"
          />
        </Card>

        {/* Currency */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          
          <SettingItem
            icon="attach-money"
            title="Currency"
            subtitle="Select your preferred currency"
            value={settings.currency}
            onPress={handleCurrencyChange}
            type="select"
          />
        </Card>

        {/* Data Management */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="info"
            title="Data Summary"
            subtitle="View your data statistics"
            value=""
            onPress={handleExportData}
            type="action"
          />
          
          <SettingItem
            icon="delete-forever"
            title="Clear All Data"
            subtitle="Permanently delete all data"
            value=""
            onPress={handleClearData}
            type="action"
          />
        </Card>

        {/* Account */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            icon="logout"
            title="Logout"
            subtitle="Sign out of your account"
            value=""
            onPress={handleLogout}
            type="action"
          />
        </Card>

        {/* App Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.APP_VERSION}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User</Text>
            <Text style={styles.infoValue}>{currentUser?.email || 'Guest'}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    paddingBottom: SPACING.XL * 2,
  },
  header: {
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,

  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,

  },
  settingIcon: {
    marginRight: SPACING.MD,
 
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,

    
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginRight: SPACING.SM,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  legalText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },

});

export default SettingsScreen;
