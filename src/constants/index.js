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

// Colors - Light Blue Theme
export const COLORS = {
  // Primary Colors - Light Blue Theme
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#1D4ED8',
  PRIMARY_LIGHT: '#60A5FA',
  
  // Secondary Colors - Blue Theme
  SECONDARY: '#0EA5E9',
  SECONDARY_DARK: '#0369A1',
  SECONDARY_LIGHT: '#38BDF8',
  
  // Accent Colors
  ACCENT: '#059669',
  ACCENT_DARK: '#047857',
  ACCENT_LIGHT: '#10B981',
  
  // Success/Error Colors
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F8FAFC',
  GRAY_100: '#F1F5F9',
  GRAY_200: '#E2E8F0',
  GRAY_300: '#CBD5E1',
  GRAY_400: '#94A3B8',
  GRAY_500: '#64748B',
  GRAY_600: '#475569',
  GRAY_700: '#334155',
  GRAY_800: '#1E293B',
  GRAY_900: '#0F172A',
  
  // Background Colors
  BACKGROUND: '#F8FAFC',
  CARD_BACKGROUND: '#FFFFFF',
  SURFACE: '#FFFFFF',
  
  // Text Colors
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_TERTIARY: '#9CA3AF',
  TEXT_INVERSE: '#FFFFFF',
  
  // Border Colors
  BORDER: '#E2E8F0',
  BORDER_LIGHT: '#F1F5F9',
  
  // Income/Expense Colors
  INCOME: '#10B981',
  EXPENSE: '#EF4444',
  
  // Gradient Colors - Light Blue Theme
  GRADIENT_PRIMARY: ['#3B82F6', '#0EA5E9'],
  GRADIENT_SECONDARY: ['#60A5FA', '#38BDF8'],
  GRADIENT_SUCCESS: ['#059669', '#10B981'],
  GRADIENT_ERROR: ['#DC2626', '#EF4444'],
  GRADIENT_WARNING: ['#D97706', '#F59E0B'],
  
  // Additional UI Colors
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  TRANSPARENT: 'transparent',
  SEMI_TRANSPARENT_WHITE: 'rgba(255, 255, 255, 0.2)',
  SEMI_TRANSPARENT_BLACK: 'rgba(0, 0, 0, 0.1)',
  
  // Status Colors
  INFO: '#3B82F6',
  INFO_LIGHT: '#DBEAFE',
  SUCCESS_LIGHT: '#D1FAE5',
  ERROR_LIGHT: '#FEE2E2',
  WARNING_LIGHT: '#FEF3C7',
  
  // Chart Colors
  CHART_COLORS: [
    '#3B82F6', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'
  ],
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
    TIGHT: 15,
    NORMAL: 20,
    RELAXED: 30,
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
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  LG: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  XL: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
      { category: 'Jan', value: 1300 },
      { category: 'Feb', value: 1200 },
      { category: 'Mar', value: 1200 },
      { category: 'Apr', value: 1200 },
      { category: 'May', value: 1200 },
      { category: 'Jun', value: 1300 },
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
