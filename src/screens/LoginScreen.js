import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, TYPOGRAPHY, SPACING, APP_CONFIG} from '../constants';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import authService from '../services/authService';
import {useToast} from '../contexts/ToastContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../navigation/AppNavigator';

const LoginScreen = ({navigation}) => {
  const {login} = useAuth();
  const {showError, showSuccess} = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.displayName.trim()) {
        newErrors.displayName = 'Name is required';
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailPasswordAuth = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      let user;

      if (isSignUp) {
        user = await authService.createUserWithEmailAndPassword(
          formData.email,
          formData.password,
          formData.displayName,
        );
        showSuccess('Account created successfully!');
      } else {
        user = await authService.signInWithEmailAndPassword(
          formData.email,
          formData.password,
        );
        showSuccess('Signed in successfully!');
      }

      login();
    } catch (error) {
      console.error('Email/Password Auth Error:', error);
      showError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await authService.signInWithGoogle();
      login();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = 'Sign in failed. Please try again.';

      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign in was cancelled.';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      showError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(resetEmail);
      showSuccess(
        `Password reset email sent to ${resetEmail}. Please check your inbox and follow the instructions.`,
      );
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      showError(
        error.message ||
          'Failed to send password reset email. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    });
    setErrors({});
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetEmail(formData.email || '');
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        style={styles.gradientBackground}
      />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💰</Text>
        </View>
        <Text style={styles.title}>Welcome to {APP_CONFIG.APP_NAME}</Text>
        <Text style={styles.subtitle}>Track your cash flow with ease</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {showForgotPassword
                ? 'Forgot Password'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </Text>
            <Text style={styles.formSubtitle}>
              {showForgotPassword
                ? "We'll help you reset your password"
                : isSignUp
                ? 'Create your account to get started'
                : 'Enter your credentials to access your data'}
            </Text>

            {/* Email/Password Form */}
            <View style={styles.emailPasswordForm}>
              {!showForgotPassword && (
                <>
                  {isSignUp && (
                    <CustomInput
                      label="Full Name"
                      value={formData.displayName}
                      onChangeText={text =>
                        setFormData({...formData, displayName: text})
                      }
                      error={errors.displayName}
                      placeholder="Enter your full name"
                      leftIcon={
                        <Icon
                          name="account"
                          size={20}
                          color={COLORS.GRAY_400}
                        />
                      }
                    />
                  )}

                  <CustomInput
                    label="Email"
                    value={formData.email}
                    onChangeText={text =>
                      setFormData({...formData, email: text})
                    }
                    error={errors.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={
                      <Icon name="email" size={20} color={COLORS.GRAY_400} />
                    }
                  />

                  <CustomInput
                    label="Password"
                    value={formData.password}
                    onChangeText={text =>
                      setFormData({...formData, password: text})
                    }
                    error={errors.password}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    leftIcon={
                      <Icon name="lock" size={20} color={COLORS.GRAY_400} />
                    }
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={COLORS.GRAY_400}
                        />
                      </TouchableOpacity>
                    }
                  />

                  {/* Forgot Password Link */}
                  {!isSignUp && (
                    <TouchableOpacity
                      onPress={toggleForgotPassword}
                      style={styles.forgotPasswordLink}>
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {/* Forgot Password Form */}
              {showForgotPassword && (
                <View style={styles.forgotPasswordForm}>
                  <Text style={styles.forgotPasswordTitle}>
                    Reset Your Password
                  </Text>
                  <Text style={styles.forgotPasswordSubtitle}>
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </Text>

                  <CustomInput
                    label="Email"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={
                      <Icon name="email" size={20} color={COLORS.GRAY_400} />
                    }
                  />

                  <View style={styles.forgotPasswordButtons}>
                    <CustomButton
                      title="Send Reset Email"
                      onPress={handleForgotPassword}
                      loading={loading}
                      style={[styles.emailPasswordButton, styles.resetButton]}
                    />

                    <TouchableOpacity
                      onPress={toggleForgotPassword}
                      style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {isSignUp && (
                <CustomInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={text =>
                    setFormData({...formData, confirmPassword: text})
                  }
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  leftIcon={
                    <Icon name="lock" size={20} color={COLORS.GRAY_400} />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      <Icon
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={COLORS.GRAY_400}
                      />
                    </TouchableOpacity>
                  }
                />
              )}

              {!showForgotPassword && (
                <>
                  <CustomButton
                    title={isSignUp ? 'Create Account' : 'Sign In'}
                    onPress={handleEmailPasswordAuth}
                    loading={loading}
                    style={styles.emailPasswordButton}
                  />

                  <TouchableOpacity
                    onPress={toggleAuthMode}
                    style={styles.toggleAuthButton}>
                    <Text style={styles.toggleAuthText}>
                      {isSignUp
                        ? 'Already have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Divider and Google Sign In - Hide when showing forgot password */}
            {!showForgotPassword && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <CustomButton
                  title="Sign in with Google"
                  onPress={handleGoogleSignIn}
                  loading={loading}
                  style={styles.googleButton}
                  icon={
                    <Icon
                      name="google"
                      size={24}
                      color={COLORS.WHITE}
                      style={styles.googleIcon}
                    />
                  }
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.XL,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.MD,
    marginTop: SPACING['3XL'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.LG,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  form: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: SPACING.XL,
    marginBottom: SPACING.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  formSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  emailPasswordForm: {
    marginBottom: SPACING.LG,
  },
  emailPasswordButton: {
    backgroundColor: COLORS.PRIMARY,
    marginTop: SPACING.MD,
  },
  toggleAuthButton: {
    marginTop: SPACING.MD,
    alignItems: 'center',
  },
  toggleAuthText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  forgotPasswordLink: {
    alignItems: 'flex-end',
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  forgotPasswordForm: {
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 16,
    padding: SPACING.LG,
    marginTop: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  forgotPasswordTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  forgotPasswordSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  forgotPasswordButtons: {
    marginTop: SPACING.MD,
  },
  resetButton: {
    marginBottom: SPACING.MD,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.MD,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    marginBottom: SPACING.LG,
  },
  googleIcon: {
    marginRight: SPACING.SM,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.LG,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    marginHorizontal: SPACING.MD,
    color: COLORS.TEXT_TERTIARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  },
  guestButton: {
    paddingVertical: SPACING.MD,
    alignItems: 'center',
  },
  guestButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  },
  linkText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
