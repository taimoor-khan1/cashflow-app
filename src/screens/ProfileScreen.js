import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, TYPOGRAPHY, SPACING, APP_CONFIG, SHADOWS} from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import {useAuth} from '../navigation/AppNavigator';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useToast } from '../contexts/ToastContext';

const ProfileScreen = ({navigation}) => {
  const { showSuccess, showError , showInfo} = useToast();
  const {logout, currentUser} = useAuth();
  const { dashboardStats } = useRealTimeData();
  
  const userStats = {
    totalTransactions: dashboardStats.totalTransactions,
    totalPersons: dashboardStats.totalPersons,
  };

  const handleEditProfile = () => {
    // navigation.navigate('EditProfile');
    showInfo('Edit profile will be available in a future update.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be available in a future update.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service will be available in a future update.');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Contact support will be available in a future update.');
  };

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getUserInitials = (displayName) => {
    if (!displayName) return '?';
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gradient Header */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Icon name="edit" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {currentUser?.photoURL ? (
              <Image 
                source={{ uri: currentUser.photoURL }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getUserInitials(currentUser?.displayName)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>
            {currentUser?.displayName || 'User'}
          </Text>
          <Text style={styles.userEmail}>
            {currentUser?.email || 'No email'}
          </Text>
          <Text style={styles.joinDate}>
            Member since {formatJoinDate(currentUser?.metadata?.creationTime)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="receipt" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.statValue}>{userStats.totalTransactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="account-balance" size={24} color={COLORS.SECONDARY} />
              <Text style={styles.statValue}>{userStats.totalPersons}</Text>
              <Text style={styles.statLabel}>Accounts</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.settingText}>App Settings</Text>
            <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <Icon name="privacy-tip" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleTermsOfService}>
            <Icon name="description" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.settingText}>Terms of Service</Text>
            <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport}>
            <Icon name="support-agent" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.settingText}>Contact Support</Text>
            <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.MD,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  userName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.SM,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.SM,
  },
  settingText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 16,
  },
  logoutSection: {
    alignItems: 'center',
  
  },
  logoutButton: {
    paddingHorizontal: 48,
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
  },
});

export default ProfileScreen;
