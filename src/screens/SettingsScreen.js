import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import ScreenHeader from '../components/ScreenHeader';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'English',
    currency: 'PKR',
    privacy: true,
    autoBackup: false,
  });

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

  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => setSettings(prev => ({ ...prev, language: 'English' })) },
        { text: 'Spanish', onPress: () => setSettings(prev => ({ ...prev, language: 'Spanish' })) },
        { text: 'French', onPress: () => setSettings(prev => ({ ...prev, language: 'French' })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported as a CSV file and saved to your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select a CSV file to import your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', onPress: () => console.log('Importing data...') },
      ]
    );
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
          onPress: () => console.log('Clearing data...') 
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
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Universal Header Component */}
        <ScreenHeader
          title="Settings"
          subtitle="Customize your app experience"
          variant="plain"
          backgroundColor={COLORS.BACKGROUND}
          onBack={() => navigation.goBack()}
          style={styles.universalHeader}
        />
        
        {/* Original Header Section - Kept for existing design */}
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
          
          <SettingItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            value={settings.darkMode}
            onPress={() => handleSettingToggle('darkMode')}
          />
          
          <SettingItem
            icon="fingerprint"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            value={settings.biometricAuth}
            onPress={() => handleSettingToggle('biometricAuth')}
          />
          
          <SettingItem
            icon="backup"
            title="Auto Backup"
            subtitle="Automatically backup your data"
            value={settings.autoBackup}
            onPress={() => handleSettingToggle('autoBackup')}
          />
        </Card>

        {/* Localization */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Localization</Text>
          
          <SettingItem
            icon="attach-money"
            title="Currency"
            subtitle="Select your preferred currency"
            value={settings.currency}
            onPress={handleCurrencyChange}
            type="select"
          />
          
          <SettingItem
            icon="language"
            title="Language"
            subtitle="Select your preferred language"
            value={settings.language}
            onPress={handleLanguageChange}
            type="select"
          />
        </Card>

        {/* Data Management */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="file-download"
            title="Export Data"
            subtitle="Download your data as CSV"
            value=""
            onPress={handleExportData}
            type="action"
          />
          
          <SettingItem
            icon="file-upload"
            title="Import Data"
            subtitle="Import data from CSV file"
            value=""
            onPress={handleImportData}
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

        {/* App Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.APP_VERSION}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.01.001</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Support</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.SUPPORT_EMAIL}</Text>
          </View>
        </Card>

        {/* Legal */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Icon name="open-in-new" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Icon name="open-in-new" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Licenses</Text>
            <Icon name="chevron-right" size={20} color={COLORS.TEXT_TERTIARY} />
          </TouchableOpacity>
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
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.SM,
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
  universalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default SettingsScreen;
