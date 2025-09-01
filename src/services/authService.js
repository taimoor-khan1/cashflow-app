import auth from '@react-native-firebase/auth';
import { dbHelpers, ensureFirebaseInitialized, GoogleSignin } from '../config/firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListener = null;
  }

  // Initialize auth state listener
  initAuthStateListener(onAuthStateChanged) {
    try {
      // Ensure Firebase is initialized
      if (!ensureFirebaseInitialized()) {
        console.error('Firebase not initialized for auth state listener');
        onAuthStateChanged(null);
        return () => {}; // Return empty cleanup function
      }
      
      this.authStateListener = auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.currentUser = user;
          // Check if user exists in database, if not create them
          await this.ensureUserInDatabase(user);
        } else {
          this.currentUser = null;
        }
        onAuthStateChanged(user);
      });
      
      // Return the unsubscribe function
      return this.authStateListener;
    } catch (error) {
      console.error('Error initializing auth state listener:', error);
      // Fallback to unauthenticated state
      onAuthStateChanged(null);
      return () => {}; // Return empty cleanup function
    }
  }

  // Remove auth state listener
  removeAuthStateListener() {
    try {
      if (this.authStateListener) {
        this.authStateListener();
        this.authStateListener = null;
      }
    } catch (error) {
      console.error('Error removing auth state listener:', error);
    }
  }

  // Check if Google Sign-In is configured
  async checkGoogleSignInConfiguration() {
    try {
      // Check if GoogleSignin is available
      if (!GoogleSignin) {
        console.error('GoogleSignin is not available');
        return false;
      }
      
      if (typeof GoogleSignin.hasPlayServices !== 'function') {
        console.error('GoogleSignin.hasPlayServices is not a function');
        return false;
      }
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      
      // Check if user is already signed in (only if method exists)
      if (typeof GoogleSignin.isSignedIn === 'function') {
        try {
          const isSignedIn = await GoogleSignin.isSignedIn();
          console.log('Google Sign-In status - isSignedIn:', isSignedIn);
          
          // Get current user info if signed in
          if (isSignedIn) {
            try {
              const currentUser = await GoogleSignin.getCurrentUser();
              console.log('Current Google user:', currentUser);
            } catch (error) {
              console.log('No current Google user or error getting user:', error);
            }
          }
        } catch (error) {
          console.log('Error checking sign-in status:', error.message);
        }
      } else {
        console.log('GoogleSignin.isSignedIn method not available');
      }
      
      // Test configuration by trying to get tokens (only if method exists)
      if (typeof GoogleSignin.getTokens === 'function') {
        try {
          const tokens = await GoogleSignin.getTokens();
          console.log('Google Sign-In tokens available:', !!tokens);
        } catch (error) {
          console.log('No tokens available (this is normal for new users):', error.message);
        }
      } else {
        console.log('GoogleSignin.getTokens method not available');
      }
      
      return true;
    } catch (error) {
      console.error('Google Sign-In configuration check failed:', error);
      return false;
    }
  }

  // Sign in with email and password
  async signInWithEmailAndPassword(email, password) {
    try {
      console.log('Starting email/password sign-in process...');
      
      // Ensure Firebase is initialized
      if (!ensureFirebaseInitialized()) {
        throw new Error('Firebase not initialized');
      }
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      console.log('Attempting email/password sign-in...');
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('Email/password sign-in completed');
      
      if (!userCredential?.user) {
        throw new Error('Failed to sign in with email and password');
      }
      
      console.log('Email/password sign-in successful for user:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('Email/password sign-in error:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('We couldn\'t find an account with this email address. Please check your email or create a new account.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('The password you entered is incorrect. Please try again or reset your password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('Your account has been temporarily disabled. Please contact support for assistance.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many unsuccessful login attempts. Please wait a few minutes before trying again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Connection issue detected. Please check your internet connection and try again.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('The email or password you entered is incorrect. Please check your credentials and try again.');
      } else {
        throw new Error(error.message || 'Something went wrong during sign in. Please try again.');
      }
    }
  }

  // Create account with email and password
  async createUserWithEmailAndPassword(email, password, displayName = '') {
    try {
      console.log('Starting account creation process...');
      
      // Ensure Firebase is initialized
      if (!ensureFirebaseInitialized()) {
        throw new Error('Firebase not initialized');
      }
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      console.log('Attempting account creation...');
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('Account creation completed');
      
      if (!userCredential?.user) {
        throw new Error('Failed to create account');
      }
      
      // Update the user's display name if provided
      if (displayName) {
        await userCredential.user.updateProfile({
          displayName: displayName
        });
      }
      
      console.log('Account creation successful for user:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('Account creation error:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in or use a different email address.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Please choose a stronger password with at least 6 characters, including letters and numbers.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Connection issue detected. Please check your internet connection and try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else {
        throw new Error(error.message || 'We couldn\'t create your account. Please try again.');
      }
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      console.log('Starting password reset process...');
      
      // Ensure Firebase is initialized
      if (!ensureFirebaseInitialized()) {
        throw new Error('Firebase not initialized');
      }
      
      // Validate input
      if (!email) {
        throw new Error('Email is required');
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      console.log('Sending password reset email...');
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully');
      
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('We couldn\'t find an account with this email address. Please check your email or create a new account.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Connection issue detected. Please check your internet connection and try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many password reset requests. Please wait a few minutes before trying again.');
      } else {
        throw new Error(error.message || 'We couldn\'t send the password reset email. Please try again.');
      }
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      console.log('Starting Google Sign-In process...');
      
      // Ensure Firebase is initialized
      if (!ensureFirebaseInitialized()) {
        throw new Error('Firebase not initialized');
      }
      console.log('Firebase initialization check passed');
      
      // Check if GoogleSignin is available
      if (!GoogleSignin) {
        throw new Error('Google Sign-In library not available');
      }
      
      // Check if Google Sign-In is configured
      const isConfigured = await this.checkGoogleSignInConfiguration();
      if (!isConfigured) {
        throw new Error('Google Sign-In not properly configured');
      }
      console.log('Google Sign-In configuration check passed');
      
      // Check if your device supports Google Play
      try {
        if (typeof GoogleSignin.hasPlayServices !== 'function') {
          throw new Error('GoogleSignin.hasPlayServices method not available');
        }
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        console.log('Google Play Services check passed');
      } catch (error) {
        console.error('Google Play Services check failed:', error);
        throw new Error('Google Play Services not available on this device');
      }
      
      // Sign out from any existing Google Sign-In session to ensure clean state
      try {
        if (typeof GoogleSignin.signOut !== 'function') {
          console.log('GoogleSignin.signOut method not available');
        } else {
          await GoogleSignin.signOut();
          console.log('Signed out from existing Google session');
        }
      } catch (error) {
        console.log('No existing Google session to sign out from');
      }
      
      console.log('Attempting Google Sign-In...');
      // Get the users ID token
      if (typeof GoogleSignin.signIn !== 'function') {
        throw new Error('GoogleSignin.signIn method not available');
      }
      const signInResult = await GoogleSignin.signIn();
      console.log('Google Sign-In result received:', signInResult);
      
      if (!signInResult || !signInResult?.data?.idToken) {
        console.error('No ID token received from Google Sign-In');
        console.error('Sign-in result:', signInResult);
        throw new Error('Failed to get ID token from Google Sign-In. Please check your configuration.');
      }
      
      const { idToken } = signInResult.data;
      console.log('ID token received, length:', idToken.length);
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('Google credential created');
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('Firebase sign-in completed');
      
      if (!userCredential?.user) {
        throw new Error('Failed to sign in with Google credential');
      }
      
      console.log('Google Sign-In successful for user:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // Provide more specific error messages
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Sign in was cancelled by user');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available on this device');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error. Please check your internet connection');
      } else if (error.message?.includes('ID token')) {
        throw new Error('Authentication failed. Please try again');
      } else if (error.message?.includes('Firebase not initialized')) {
        throw new Error('App initialization error. Please restart the app');
      } else if (error.message?.includes('apiClient is null')) {
        throw new Error('Google Sign-In not configured. Please restart the app');
      } else if (error.message?.includes('Google Sign-In not properly configured')) {
        throw new Error('Google Sign-In configuration error. Please restart the app');
      } else {
        throw new Error('Sign in failed. Please try again');
      }
    }
  }

  // Sign out
  async signOut() {
    try {
      // Sign out from both Google and Firebase
      await Promise.all([
        GoogleSignin.signOut(),
        auth().signOut()
      ]);
      
      this.currentUser = null;
    } catch (error) {
      console.error('Sign Out Error:', error);
      // Even if there's an error, clear the local user state
      this.currentUser = null;
      throw new Error('Sign out failed. Please try again');
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Ensure user exists in database
  async ensureUserInDatabase(user) {
    try {
      if (!user?.uid) {
        console.error('Invalid user object:', user);
        return;
      }

      const userSnapshot = await dbHelpers.getUser(user.uid);
      
      if (!userSnapshot.exists()) {
        // Create new user in database
        const userData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };
        
        await dbHelpers.createUser(user.uid, userData);
        console.log('New user created in database:', user.uid);
      } else {
        // Update last login time
        await dbHelpers.updateUser(user.uid, {
          lastLoginAt: Date.now(),
        });
        console.log('User login time updated:', user.uid);
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
      // Don't throw error here as it shouldn't prevent login
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Get user ID
  getUserId() {
    return this.currentUser?.uid;
  }

  // Check if user has required fields
  isUserValid() {
    return this.currentUser && this.currentUser.uid && this.currentUser.email;
  }
}

export default new AuthService();
