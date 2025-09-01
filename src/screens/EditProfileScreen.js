import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../navigation/AppNavigator';
import dataService from '../services/dataService';
import auth from '@react-native-firebase/auth';

const EditProfileScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    company: '',
    position: '',
    location: '',
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setInitialLoading(true);
      if (currentUser) {
        const userId = currentUser.uid;
        
        // Try to load existing profile data from Firebase
        try {
          const profileSnapshot = await dataService.dbRefs.userProfile(userId).once('value');
          const profileData = profileSnapshot.val();
          
          if (profileData) {
            setFormData({
              firstName: profileData.firstName || '',
              lastName: profileData.lastName || '',
              email: profileData.email || currentUser.email || '',
              phone: profileData.phone || '',
              bio: profileData.bio || '',
              company: profileData.company || '',
              position: profileData.position || '',
              location: profileData.location || '',
              website: profileData.website || '',
            });
          } else {
            // Use current user data as fallback
            const displayName = currentUser.displayName || '';
            const [firstName = '', lastName = ''] = displayName.split(' ');
            
            setFormData({
              firstName: firstName,
              lastName: lastName,
              email: currentUser.email || '',
              phone: '',
              bio: '',
              company: '',
              position: '',
              location: '',
              website: '',
            });
          }
        } catch (firebaseError) {
          console.error('Error loading profile from Firebase:', firebaseError);
          // Fallback to current user data
          const displayName = currentUser.displayName || '';
          const [firstName = '', lastName = ''] = displayName.split(' ');
          
          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: currentUser.email || '',
            phone: '',
            bio: '',
            company: '',
            position: '',
            location: '',
            website: '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website.trim() && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Store profile data in Firebase Realtime Database
      const userId = currentUser?.uid;
      if (userId) {
        const profileData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
          company: formData.company.trim(),
          position: formData.position.trim(),
          location: formData.location.trim(),
          website: formData.website.trim(),
          updatedAt: new Date().toISOString(),
        };

        // Store in Firebase Realtime Database under user profile
        await dataService.dbRefs.userProfile(userId).set(profileData);
      }

      // Success - navigate back
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'A password reset link will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Link', 
          onPress: async () => {
            try {
              if (currentUser?.email) {
                // Firebase Auth password reset
                await auth().sendPasswordResetEmail(currentUser.email);
                Alert.alert('Success', 'Password reset email sent! Check your inbox.');
              } else {
                Alert.alert('Error', 'No email address found for this account.');
              }
            } catch (error) {
              console.error('Password reset error:', error);
              Alert.alert('Error', 'Failed to send password reset email. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (currentUser) {
                // Delete all user data first
                const userId = currentUser.uid;
                
                // Delete persons and transactions
                const persons = await dataService.getPersons();
                const transactions = await dataService.getTransactions();
                
                for (const transaction of transactions) {
                  await dataService.deleteTransaction(transaction.id);
                }
                
                for (const person of persons) {
                  await dataService.deletePerson(person.id);
                }
                
                // Delete user profile
                await dataService.dbRefs.userProfile(userId).remove();
                
                // Delete Firebase Auth account
                await currentUser.delete();
                
                Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
                logout();
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Profile picture functionality will be available in a future update with Firebase Storage integration.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={28} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                <View style={styles.profilePicture}>
                  <Icon name="person" size={48} color={COLORS.GRAY_400} />
                </View>
                <TouchableOpacity style={styles.changePictureButton} onPress={handleChangeProfilePicture}>
                  <Icon name="camera-alt" size={20} color={COLORS.WHITE} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profilePictureText}>Tap to change profile picture</Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View style={styles.nameRow}>
              <CustomInput
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter first name"
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.firstName}
                style={styles.halfWidth}
              />
              <CustomInput
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter last name"
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.lastName}
                style={styles.halfWidth}
              />
            </View>

            <CustomInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <CustomInput
              label="Phone Number (Optional)"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <CustomInput
              label="Bio (Optional)"
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </View>

            <View style={styles.nameRow}>
              <CustomInput
                label="Company"
                value={formData.company}
                onChangeText={(value) => handleInputChange('company', value)}
                placeholder="Enter company name"
                autoCapitalize="words"
                style={styles.halfWidth}
              />
              <CustomInput
                label="Position"
                value={formData.position}
                onChangeText={(value) => handleInputChange('position', value)}
                placeholder="Enter job title"
                autoCapitalize="words"
                style={styles.halfWidth}
              />
            </View>

            <CustomInput
              label="Location"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Enter your location"
              autoCapitalize="words"
            />

            <CustomInput
              label="Website (Optional)"
              value={formData.website}
              onChangeText={(value) => handleInputChange('website', value)}
              placeholder="https://yourwebsite.com"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.cancelButton}
              />
              <CustomButton
                title="Save Changes"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          </View>

          {/* Additional Options */}
          <View style={styles.optionsSection}>
            <Text style={styles.optionsTitle}>Account Options</Text>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleResetPassword}>
              <View style={styles.optionContent}>
                <Icon name="lock" size={24} color={COLORS.PRIMARY} />
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>Reset Password</Text>
                  <Text style={styles.optionDescription}>Change your account password</Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={28} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Icon name="notifications" size={24} color={COLORS.PRIMARY} />
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>Notification Settings</Text>
                  <Text style={styles.optionDescription}>Manage your notification preferences</Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={28} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Icon name="security" size={24} color={COLORS.PRIMARY} />
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>Privacy & Security</Text>
                  <Text style={styles.optionDescription}>Manage your privacy settings</Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={28} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleDeleteAccount}>
              <View style={styles.optionContent}>
                <Icon name="delete" size={24} color={COLORS.ERROR} />
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: COLORS.ERROR }]}>Delete Account</Text>
                  <Text style={styles.optionDescription}>Permanently remove your account</Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={28} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Icon name="logout" size={24} color={COLORS.ERROR} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight,
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderBottomLeftRadius: BORDER_RADIUS.XL,
    borderBottomRightRadius: BORDER_RADIUS.XL,
    ...SHADOWS.MD,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SPACING.SM,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40, // Adjust as needed for spacing
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.XL,
  },
  form: {
    padding: SPACING.MD,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  profilePictureContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_200,
    ...SHADOWS.SM,
  },
  profilePicture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  profilePictureText: {
    marginTop: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginTop: SPACING.XL,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  optionsSection: {
    padding: SPACING.LG,
  },
  optionsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    ...SHADOWS.SM,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  optionDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  optionArrow: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  sectionHeader: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  logoutSection: {
    padding: SPACING.MD,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.SM,
  },
  logoutText: {
    marginLeft: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.ERROR,
  },
});

export default EditProfileScreen;
