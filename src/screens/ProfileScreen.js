import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, TYPOGRAPHY, SPACING, APP_CONFIG, SHADOWS} from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import {useAuth} from '../navigation/AppNavigator';

const ProfileScreen = ({navigation}) => {
  const {logout} = useAuth();
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    joinDate: 'January 2024',
    totalTransactions: 45,
    totalPersons: 8,
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
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
    // Navigate to privacy policy or open URL
    console.log('Open privacy policy');
  };

  const handleTermsOfService = () => {
    // Navigate to terms of service or open URL
    console.log('Open terms of service');
  };

  const handleContactSupport = () => {
    // Open email or contact support
    console.log('Contact support');
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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="receipt" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.statValue}>{user.totalTransactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="people" size={24} color={COLORS.SECONDARY} />
              <Text style={styles.statValue}>{user.totalPersons}</Text>
              <Text style={styles.statLabel}>People</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
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
  },
});

export default ProfileScreen;
