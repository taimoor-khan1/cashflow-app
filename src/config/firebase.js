import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/app';

// Try different import patterns for Google Sign-In v15.0.0
let GoogleSignin = null;

try {
  // Try ES6 import first
  const GoogleSigninModule = require('@react-native-google-signin/google-signin');
  console.log('GoogleSignin module loaded:', GoogleSigninModule);
  
  if (GoogleSigninModule.GoogleSignin) {
    GoogleSignin = GoogleSigninModule.GoogleSignin;
    console.log('Using GoogleSigninModule.GoogleSignin');
  } else if (GoogleSigninModule.default) {
    GoogleSignin = GoogleSigninModule.default;
    console.log('Using GoogleSigninModule.default');
  } else {
    GoogleSignin = GoogleSigninModule;
    console.log('Using GoogleSigninModule directly');
  }
  
  console.log('GoogleSignin object:', GoogleSignin);
  console.log('GoogleSignin type:', typeof GoogleSignin);
  
} catch (e) {
  console.error('Failed to load GoogleSignin module:', e.message);
}

// Check if GoogleSignin is properly imported
if (!GoogleSignin) {
  console.error('GoogleSignin import failed');
} else {
  console.log('GoogleSignin imported successfully');
  console.log('GoogleSignin properties:', Object.keys(GoogleSignin));
  console.log('GoogleSignin.configure type:', typeof GoogleSignin.configure);
  console.log('GoogleSignin.isSignedIn type:', typeof GoogleSignin.isSignedIn);
}
if (typeof GoogleSignin.configure !== 'function') {
  console.error('GoogleSignin.configure is not a function');
}

// Initialize Firebase if not already initialized
try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyAOV9BWSGlN47nVxaR5lY1PjdWNeRd9i1U",
      authDomain: "cashflow-52de6.firebaseapp.com",
      databaseURL: "https://cashflow-52de6-default-rtdb.firebaseio.com",
      projectId: "cashflow-52de6",
      storageBucket: "cashflow-52de6.firebasestorage.app",
      messagingSenderId: "138813716042",
      appId: "1:138813716042:web:27e72c593b9ba2699658b3",
      measurementId: "G-46J8DKP5F9"
    });
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase already initialized');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize Google Sign-In with a placeholder (you need to update this)
const initializeGoogleSignIn = () => {
  try {
    const webClientId = '138813716042-3pe5skj555h3isiq0l69tc7mha0maatp.apps.googleusercontent.com';
    
    // Debug: Log the entire GoogleSignin object
    console.log('Full GoogleSignin object:', GoogleSignin);
    console.log('GoogleSignin type:', typeof GoogleSignin);
    console.log('GoogleSignin constructor:', GoogleSignin.constructor);
    
    // Check if GoogleSignin is properly structured
    if (!GoogleSignin || typeof GoogleSignin !== 'object') {
      console.log('GoogleSignin import failed - no valid object available');
      throw new Error('GoogleSignin is not a valid object');
    }
    
    // For Google Sign-In v15.0.0, use minimal configuration first
    const config = {
      webClientId: webClientId,
    };
    
    // Add optional properties only if they exist in the library
    try {
      // Test if these properties are supported
      if (typeof GoogleSignin.configure === 'function') {
        GoogleSignin.configure(config);
        console.log('Google Sign-In configured successfully with minimal config:', config);
        
        // Try to add additional properties one by one
        try {
          GoogleSignin.configure({
            ...config,
            offlineAccess: true,
          });
          console.log('Added offlineAccess successfully');
        } catch (e) {
          console.log('offlineAccess not supported, using minimal config');
        }
        
        try {
          GoogleSignin.configure({
            ...config,
            forceCodeForRefreshToken: true,
          });
          console.log('Added forceCodeForRefreshToken successfully');
        } catch (e) {
          console.log('forceCodeForRefreshToken not supported, using minimal config');
        }
        
        try {
          GoogleSignin.configure({
            ...config,
            scopes: ['profile', 'email'],
          });
          console.log('Added scopes successfully');
        } catch (e) {
          console.log('scopes not supported, using minimal config');
        }
        
      } else {
        throw new Error('GoogleSignin.configure is not a function');
      }
    } catch (configError) {
      console.error('Configuration error:', configError);
      throw configError;
    }
    
  } catch (error) {
    console.error('Google Sign-In configuration error:', error);
  }
};

// Call the initialization function
initializeGoogleSignIn();

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAOV9BWSGlN47nVxaR5lY1PjdWNeRd9i1U",
  authDomain: "cashflow-52de6.firebaseapp.com",
  databaseURL: "https://cashflow-52de6-default-rtdb.firebaseio.com",
  projectId: "cashflow-52de6",
  storageBucket: "cashflow-52de6.firebasestorage.app",
  messagingSenderId: "138813716042",
  appId: "1:138813716042:web:27e72c593b9ba2699658b3",
  measurementId: "G-46J8DKP5F9"
};

// Export Firebase services
export { auth, database };

// Export the dynamically loaded GoogleSignin
export { GoogleSignin };

// Ensure Firebase is initialized before exporting
export const ensureFirebaseInitialized = () => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAOV9BWSGlN47nVxaR5lY1PjdWNeRd9i1U",
        authDomain: "cashflow-52de6.firebaseapp.com",
        databaseURL: "https://cashflow-52de6-default-rtdb.firebaseio.com",
        projectId: "cashflow-52de6",
        storageBucket: "cashflow-52de6.firebasestorage.app",
        messagingSenderId: "138813716042",
        appId: "1:138813716042:web:27e72c593b9ba2699658b3",
        measurementId: "G-46J8DKP5F9"
      });
      console.log('Firebase initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
};

// Database references
export const dbRefs = {
  users: database().ref('users'),
  persons: database().ref('persons'),
  transactions: database().ref('transactions'),
  categories: database().ref('categories'),
};

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  createUser: (userId, userData) => {
    return dbRefs.users.child(userId).set(userData);
  },
  
  updateUser: (userId, updates) => {
    return dbRefs.users.child(userId).update(updates);
  },
  
  getUser: (userId) => {
    return dbRefs.users.child(userId).once('value');
  },
  
  // Person operations
  createPerson: (userId, personData) => {
    const personRef = dbRefs.persons.child(userId).push();
    const personId = personRef.key;
    return personRef.set({ ...personData, id: personId, createdAt: Date.now() });
  },
  
  updatePerson: (userId, personId, updates) => {
    return dbRefs.persons.child(userId).child(personId).update(updates);
  },
  
  deletePerson: (userId, personId) => {
    return dbRefs.persons.child(userId).child(personId).remove();
  },
  
  getPersons: (userId) => {
    return dbRefs.persons.child(userId).once('value');
  },
  
  // Transaction operations
  createTransaction: (userId, transactionData) => {
    const transactionRef = dbRefs.transactions.child(userId).push();
    const transactionId = transactionRef.key;
    return transactionRef.set({ ...transactionData, id: transactionId, createdAt: Date.now() });
  },
  
  updateTransaction: (userId, transactionId, updates) => {
    return dbRefs.transactions.child(userId).child(transactionId).update(updates);
  },
  
  deleteTransaction: (userId, transactionId) => {
    return dbRefs.transactions.child(userId).child(transactionId).remove();
  },
  
  getTransactions: (userId) => {
    return dbRefs.transactions.child(userId).once('value');
  },
  
  // Category operations
  createCategory: (userId, categoryData) => {
    const categoryRef = dbRefs.categories.child(userId).push();
    const categoryId = categoryRef.key;
    return categoryRef.set({ ...categoryData, id: categoryId, createdAt: Date.now() });
  },

  updateCategory: (userId, categoryId, updates) => {
    return dbRefs.categories.child(userId).child(categoryId).update(updates);
  },

  deleteCategory: (userId, categoryId) => {
    return dbRefs.categories.child(userId).child(categoryId).remove();
  },

  getCategories: (userId) => {
    return dbRefs.categories.child(userId).once('value');
  },

  listenToCategories: (userId, callback) => {
    return dbRefs.categories.child(userId).on('value', callback);
  },

  removeCategoriesListener: (userId) => {
    return dbRefs.categories.child(userId).off();
  },
  
  // Real-time listeners
  listenToPersons: (userId, callback) => {
    return dbRefs.persons.child(userId).on('value', callback);
  },
  
  listenToTransactions: (userId, callback) => {
    return dbRefs.transactions.child(userId).on('value', callback);
  },
  
  // Remove listeners
  removePersonsListener: (userId) => {
    return dbRefs.persons.child(userId).off();
  },
  
  removeTransactionsListener: (userId) => {
    return dbRefs.transactions.child(userId).off();
  },
};
