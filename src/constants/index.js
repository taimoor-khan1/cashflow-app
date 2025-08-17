// Screen Names
export const SCREENS = {
  // Auth Stack
  SPLASH: 'Splash',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  
  // Main App
  DASHBOARD: 'Dashboard',
  PERSONS: 'Persons',
  PERSONS_LIST: 'PersonsList',
  REPORTS: 'Reports',
  PROFILE: 'Profile',
  
  // Person Screens
  ADD_PERSON: 'AddPerson',
  EDIT_PERSON: 'EditPerson',
  PERSON_DETAIL: 'PersonDetail',
  
  // Transaction Screens
  ADD_TRANSACTION: 'AddTransaction',
  TRANSACTION_DETAIL: 'TransactionDetail',
  TRANSACTIONS_LIST: 'TransactionsList',
  
  // Profile Screens
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
};

// Navigation Names
export const NAVIGATION = {
  AUTH_STACK: 'AuthStack',
  MAIN_TABS: 'MainTabs',
};

// Colors
export const COLORS = {
  // Primary Colors
  PRIMARY: '#007AFF',
  PRIMARY_DARK: '#0056CC',
  PRIMARY_LIGHT: '#4DA3FF',
  
  // Secondary Colors
  SECONDARY: '#34C759',
  SECONDARY_DARK: '#28A745',
  SECONDARY_LIGHT: '#5CDB95',
  
  // Accent Colors
  ACCENT: '#FF9500',
  ACCENT_DARK: '#E6850E',
  ACCENT_LIGHT: '#FFB340',
  
  // Success/Error Colors
  SUCCESS: '#34C759',
  ERROR: '#FF3B30',
  WARNING: '#FF9500',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9F9F9',
  GRAY_100: '#F2F2F7',
  GRAY_200: '#E5E5EA',
  GRAY_300: '#D1D1D6',
  GRAY_400: '#C7C7CC',
  GRAY_500: '#AEAEB2',
  GRAY_600: '#8E8E93',
  GRAY_700: '#636366',
  GRAY_800: '#48484A',
  GRAY_900: '#1C1C1E',
  
  // Background Colors
  BACKGROUND: '#F9F9F9',
  CARD_BACKGROUND: '#FFFFFF',
  SURFACE: '#FFFFFF',
  
  // Text Colors
  TEXT_PRIMARY: '#1C1C1E',
  TEXT_SECONDARY: '#636366',
  TEXT_TERTIARY: '#8E8E93',
  TEXT_INVERSE: '#FFFFFF',
  
  // Border Colors
  BORDER: '#E5E5EA',
  BORDER_LIGHT: '#F2F2F7',
  
  // Income/Expense Colors
  INCOME: '#34C759',
  EXPENSE: '#FF3B30',
};

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: 'System',
    MEDIUM: 'System',
    SEMIBOLD: 'System',
    BOLD: 'System',
  },
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    BASE: 16,
    LG: 18,
    XL: 20,
    '2XL': 24,
    '3XL': 30,
    '4XL': 36,
  },
  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
  FONT_WEIGHT: {
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  },
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  '2XL': 48,
  '3XL': 64,
};

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  '2XL': 24,
  FULL: 9999,
};

// Shadows
export const SHADOWS = {
  SM: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  MD: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  LG: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Mock Data
export const MOCK_DATA = {
  USERS: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
    },
  ],
  PERSONS: [
    {
      id: '1',
      name: 'Alice Johnson',
      notes: 'Client from marketing agency',
      balance: 1250.00,
      totalIncome: 2000.00,
      totalExpenses: 750.00,
      transactionCount: 8,
    },
    {
      id: '2',
      name: 'Bob Smith',
      notes: 'Friend - shared expenses',
      balance: -320.50,
      totalIncome: 150.00,
      totalExpenses: 470.50,
      transactionCount: 12,
    },
    {
      id: '3',
      name: 'Carol Davis',
      notes: 'Business partner',
      balance: 2800.00,
      totalIncome: 5000.00,
      totalExpenses: 2200.00,
      transactionCount: 15,
    },
  ],
  TRANSACTIONS: [
    {
      id: '1',
      personId: '1',
      type: 'income',
      amount: 500.00,
      category: 'Payment',
      notes: 'Website design payment',
      date: '2024-01-15',
      personName: 'Alice Johnson',
      attachment: {
        uri: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Invoice',
        type: 'image/jpeg',
        name: 'invoice.jpg',
      },
    },
    {
      id: '2',
      personId: '1',
      type: 'expense',
      amount: 150.00,
      category: 'Materials',
      notes: 'Design software license',
      date: '2024-01-14',
      personName: 'Alice Johnson',
      attachment: {
        uri: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Receipt',
        type: 'image/jpeg',
        name: 'receipt.jpg',
      },
    },
    {
      id: '3',
      personId: '2',
      type: 'expense',
      amount: 85.50,
      category: 'Food',
      notes: 'Dinner at restaurant',
      date: '2024-01-13',
      personName: 'Bob Smith',
    },
    {
      id: '4',
      personId: '3',
      type: 'income',
      amount: 2000.00,
      category: 'Project',
      notes: 'Q1 project completion',
      date: '2024-01-12',
      personName: 'Carol Davis',
      attachment: {
        uri: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Contract',
        type: 'image/jpeg',
        name: 'contract.jpg',
      },
    },
    {
      id: '5',
      personId: '2',
      type: 'expense',
      amount: 45.00,
      category: 'Transport',
      notes: 'Uber ride to meeting',
      date: '2024-01-11',
      personName: 'Bob Smith',
    },
    {
      id: '6',
      personId: '3',
      type: 'expense',
      amount: 120.00,
      category: 'Materials',
      notes: 'Office supplies',
      date: '2024-01-10',
      personName: 'Carol Davis',
      attachment: {
        uri: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Receipt',
        type: 'image/jpeg',
        name: 'receipt.jpg',
      },
    },
  ],
  CATEGORIES: [
    'Payment',
    'Project',
    'Materials',
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Other',
  ],
  CHART_DATA: {
    monthlyCashFlow: [
      { month: 'Jan', income: 2500, expenses: 1200 },
      { month: 'Feb', income: 3000, expenses: 1800 },
      { month: 'Mar', income: 2800, expenses: 1600 },
      { month: 'Apr', income: 3200, expenses: 2000 },
      { month: 'May', income: 2900, expenses: 1700 },
      { month: 'Jun', income: 3500, expenses: 2200 },
    ],
    categoryBreakdown: [
      { category: 'Payment', value: 45 },
      { category: 'Project', value: 30 },
      { category: 'Materials', value: 15 },
      { category: 'Other', value: 10 },
    ],
  },
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'CashFlow',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@cashflow.com',
  PRIVACY_POLICY_URL: 'https://cashflow.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://cashflow.com/terms',
};
