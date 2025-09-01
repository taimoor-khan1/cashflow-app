import { dbHelpers } from '../config/firebase';
import authService from './authService';

class DataService {
  constructor() {
    this.currentUserId = null;
    this.personsListener = null;
    this.transactionsListener = null;
    this.categoriesListener = null;
  }

  // Initialize service with current user
  init(userId) {
    console.log('DataService.init called with userId:', userId);
    if (!userId) {
      console.error('User ID is required to initialize data service');
      throw new Error('User ID is required to initialize data service');
    }
    this.currentUserId = userId;
    console.log('Data service initialized for user:', userId);
  }

  // Get current user ID
  getCurrentUserId() {
    if (!this.currentUserId) {
      this.currentUserId = authService.getUserId();
    }
    
    if (!this.currentUserId) {
      throw new Error('User not authenticated. Please sign in again.');
    }
    
    return this.currentUserId;
  }

  // Check if service is properly initialized
  isInitialized() {
    try {
      const userId = this.getCurrentUserId();
      return !!userId;
    } catch (error) {
      console.error('Data service not initialized:', error);
      return false;
    }
  }

  // Ensure service is initialized before operations
  ensureInitialized() {
    if (!this.isInitialized()) {
      throw new Error('Data service not initialized. Please sign in again.');
    }
  }

  // PERSON OPERATIONS
  async createPerson(personData) {
    try {
      if (!personData?.name?.trim()) {
        throw new Error('Person name is required');
      }

      const userId = this.getCurrentUserId();
      
      const result = await dbHelpers.createPerson(userId, {
        ...personData,
        name: personData.name.trim(),
        notes: personData.notes?.trim() || '',
        userId,
        updatedAt: Date.now(),
      });
      
      console.log('Person created successfully:', personData.name);
      return result;
    } catch (error) {
      console.error('Error creating person:', error);
      throw new Error(`Failed to create person: ${error.message}`);
    }
  }

  async updatePerson(personId, updates) {
    try {
      if (!personId) {
        throw new Error('Person ID is required');
      }

      if (updates?.name && !updates.name.trim()) {
        throw new Error('Person name cannot be empty');
      }

      const userId = this.getCurrentUserId();
      
      const result = await dbHelpers.updatePerson(userId, personId, {
        ...updates,
        updatedAt: Date.now(),
      });
      
      console.log('Person updated successfully:', personId);
      return result;
    } catch (error) {
      console.error('Error updating person:', error);
      throw new Error(`Failed to update person: ${error.message}`);
    }
  }

  async deletePerson(personId) {
    try {
      if (!personId) {
        throw new Error('Person ID is required');
      }

      const userId = this.getCurrentUserId();
      
      // First, delete all transactions for this person
      const transactionsSnapshot = await dbHelpers.getTransactions(userId);
      const transactions = transactionsSnapshot.val() || {};
      
      const deletePromises = [];
      Object.keys(transactions).forEach(transactionId => {
        if (transactions[transactionId].personId === personId) {
          deletePromises.push(dbHelpers.deleteTransaction(userId, transactionId));
        }
      });
      
      // Wait for all transactions to be deleted
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} transactions for person:`, personId);
      }
      
      // Then delete the person
      const result = await dbHelpers.deletePerson(userId, personId);
      
      console.log('Person deleted successfully:', personId);
      return result;
    } catch (error) {
      console.error('Error deleting person:', error);
      throw new Error(`Failed to delete person: ${error.message}`);
    }
  }

  async getPersons() {
    try {
      const userId = this.getCurrentUserId();
      console.log('Getting persons for user:', userId);
      
      const snapshot = await dbHelpers.getPersons(userId);
      const persons = snapshot.val() || {};
      console.log('Raw persons snapshot:', persons);
      
      // Convert to array and add IDs
      const personsArray = Object.keys(persons).map(id => ({
        id,
        ...persons[id],
      }));
      
      console.log(`Retrieved ${personsArray.length} persons for user:`, userId);
      console.log('Persons array:', personsArray);
      return personsArray;
    } catch (error) {
      console.error('Error getting persons:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }

  // TRANSACTION OPERATIONS
  async createTransaction(transactionData) {
    try {
      if (!transactionData?.amount || isNaN(parseFloat(transactionData.amount))) {
        throw new Error('Valid amount is required');
      }

      if (!transactionData?.type || !['income', 'expense'].includes(transactionData.type)) {
        throw new Error('Transaction type must be income or expense');
      }

      if (!transactionData?.personId) {
        throw new Error('Person ID is required');
      }

      const userId = this.getCurrentUserId();
      
      const result = await dbHelpers.createTransaction(userId, {
        ...transactionData,
        amount: parseFloat(transactionData.amount),
        type: transactionData.type,
        personId: transactionData.personId,
        title: transactionData.title?.trim() || transactionData.category || 'Transaction',
        category: transactionData.category?.trim() || 'Other',
        notes: transactionData.notes?.trim() || '',
        date: transactionData.date || new Date().toISOString().split('T')[0],
        userId,
        updatedAt: Date.now(),
      });
      
      console.log('Transaction created successfully:', transactionData.amount);
      return result;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async updateTransaction(transactionId, updates) {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      if (updates?.amount && isNaN(parseFloat(updates.amount))) {
        throw new Error('Amount must be a valid number');
      }

      const userId = this.getCurrentUserId();
      
      const result = await dbHelpers.updateTransaction(userId, transactionId, {
        ...updates,
        updatedAt: Date.now(),
      });
      
      console.log('Transaction updated successfully:', transactionId);
      return result;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async deleteTransaction(transactionId) {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      const userId = this.getCurrentUserId();
      
      const result = await dbHelpers.deleteTransaction(userId, transactionId);
      
      console.log('Transaction deleted successfully:', transactionId);
      return result;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }

  async getTransactions() {
    try {
      const userId = this.getCurrentUserId();
      console.log('Getting transactions for user:', userId);
      
      const snapshot = await dbHelpers.getTransactions(userId);
      const transactions = snapshot.val() || {};
      console.log('Raw transactions snapshot:', transactions);
      console.log('Raw transactions keys:', Object.keys(transactions));
      
      // Convert to array and add IDs
      const transactionsArray = Object.keys(transactions).map(id => ({
        id,
        ...transactions[id],
      }));
      
      console.log(`Retrieved ${transactionsArray.length} transactions for user:`, userId);
      console.log('Transactions array sample:', transactionsArray.slice(0, 3));
      
      // Log a few sample transactions to see their structure
      if (transactionsArray.length > 0) {
        console.log('Sample transaction structure:', {
          id: transactionsArray[0].id,
          date: transactionsArray[0].date,
          type: transactionsArray[0].type,
          amount: transactionsArray[0].amount,
          category: transactionsArray[0].category,
          personId: transactionsArray[0].personId
        });
      }
      
      return transactionsArray;
    } catch (error) {
      console.error('Error getting transactions:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }

  // CATEGORY OPERATIONS
  async createCategory(categoryData) {
    try {
      if (!categoryData?.name?.trim()) {
        throw new Error('Category name is required');
      }

      const userId = this.getCurrentUserId();
      
      // Check if category already exists
      const existingCategories = await this.getCategories();
      const normalizedName = categoryData.name.trim().toLowerCase();
      const existingCategory = existingCategories.find(cat => 
        cat.name.toLowerCase() === normalizedName
      );
      
      if (existingCategory) {
        throw new Error('A category with this name already exists');
      }
      
      const result = await dbHelpers.createCategory(userId, {
        ...categoryData,
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || '',
        color: categoryData.color || '#6366F1',
        icon: categoryData.icon || 'category',
        userId,
        updatedAt: Date.now(),
      });
      
      console.log('Category created successfully:', categoryData.name);
      return result;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async updateCategory(categoryId, updates) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      if (updates?.name && !updates.name.trim()) {
        throw new Error('Category name cannot be empty');
      }

      const userId = this.getCurrentUserId();
      
      // If updating name, check for duplicates
      if (updates?.name) {
        const existingCategories = await this.getCategories();
        const normalizedName = updates.name.trim().toLowerCase();
        const duplicateCategory = existingCategories.find(cat => 
          cat.name.toLowerCase() === normalizedName && cat.id !== categoryId
        );
        
        if (duplicateCategory) {
          throw new Error('A category with this name already exists');
        }
      }
      
      const result = await dbHelpers.updateCategory(userId, categoryId, {
        ...updates,
        updatedAt: Date.now(),
      });
      
      console.log('Category updated successfully:', categoryId);
      return result;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async deleteCategory(categoryId, replacementCategoryId = null) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const userId = this.getCurrentUserId();
      
      // Check if category is being used in transactions
      const transactions = await this.getTransactions();
      const categoryTransactions = transactions.filter(t => t.category === categoryId);
      
      if (categoryTransactions.length > 0) {
        if (!replacementCategoryId) {
          throw new Error(`Cannot delete category. It is used in ${categoryTransactions.length} transaction(s). Please provide a replacement category.`);
        }
        
        // Update all transactions to use replacement category
        const updatePromises = categoryTransactions.map(transaction =>
          this.updateTransaction(transaction.id, { category: replacementCategoryId })
        );
        
        await Promise.all(updatePromises);
        console.log(`Updated ${categoryTransactions.length} transactions with replacement category`);
      }
      
      const result = await dbHelpers.deleteCategory(userId, categoryId);
      
      console.log('Category deleted successfully:', categoryId);
      return result;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  async getCategories() {
    try {
      const userId = this.getCurrentUserId();
      console.log('Getting categories for user:', userId);
      
      const snapshot = await dbHelpers.getCategories(userId);
      const categories = snapshot.val() || {};
      console.log('Raw categories snapshot:', categories);
      
      // Convert to array and add IDs
      const categoriesArray = Object.keys(categories).map(id => ({
        id,
        ...categories[id],
      }));
      
      // If no custom categories exist, return default categories
      if (categoriesArray.length === 0) {
        return this.getDefaultCategories();
      }
      
      console.log(`Retrieved ${categoriesArray.length} categories for user:`, userId);
      return categoriesArray;
    } catch (error) {
      console.error('Error getting categories:', error);
      // Return default categories instead of empty array
      return this.getDefaultCategories();
    }
  }

  getDefaultCategories() {
    return [
      { id: 'payment', name: 'Payment', description: 'General payments', color: '#10B981', icon: 'payment' },
      { id: 'project', name: 'Project', description: 'Project-related expenses', color: '#6366F1', icon: 'work' },
      { id: 'materials', name: 'Materials', description: 'Materials and supplies', color: '#F59E0B', icon: 'build' },
      { id: 'food', name: 'Food', description: 'Food and dining', color: '#EF4444', icon: 'restaurant' },
      { id: 'transport', name: 'Transport', description: 'Transportation costs', color: '#8B5CF6', icon: 'directions_car' },
      { id: 'entertainment', name: 'Entertainment', description: 'Entertainment and leisure', color: '#EC4899', icon: 'movie' },
      { id: 'utilities', name: 'Utilities', description: 'Utilities and bills', color: '#06B6D4', icon: 'electrical_services' },
      { id: 'other', name: 'Other', description: 'Miscellaneous expenses', color: '#6B7280', icon: 'category' },
    ];
  }

  async initializeDefaultCategories() {
    try {
      const userId = this.getCurrentUserId();
      const existingCategories = await this.getCategories();
      
      // Only initialize if no categories exist
      if (existingCategories.length === 0 || existingCategories.every(cat => cat.id.length < 10)) {
        const defaultCategories = this.getDefaultCategories();
        
        const createPromises = defaultCategories.map(category =>
          this.createCategory({
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
          })
        );
        
        await Promise.all(createPromises);
        console.log('Default categories initialized for user:', userId);
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
    }
  }

  // REAL-TIME LISTENERS
  listenToPersons(callback) {
    try {
      if (typeof callback !== 'function') {
        throw new Error('Callback function is required');
      }

      const userId = this.getCurrentUserId();
      
      this.personsListener = dbHelpers.listenToPersons(userId, (snapshot) => {
        try {
          const persons = snapshot.val() || {};
          const personsArray = Object.keys(persons).map(id => ({
            id,
            ...persons[id],
          }));
          callback(personsArray);
        } catch (error) {
          console.error('Error in persons listener callback:', error);
        }
      });
      
      console.log('Persons listener set up for user:', userId);
      return this.personsListener;
    } catch (error) {
      console.error('Error setting up persons listener:', error);
      throw new Error(`Failed to set up persons listener: ${error.message}`);
    }
  }

  listenToTransactions(callback) {
    try {
      if (typeof callback !== 'function') {
        throw new Error('Callback function is required');
      }

      const userId = this.getCurrentUserId();
      
      this.transactionsListener = dbHelpers.listenToTransactions(userId, (snapshot) => {
        try {
          const transactions = snapshot.val() || {};
          const transactionsArray = Object.keys(transactions).map(id => ({
            id,
            ...transactions[id],
          }));
          callback(transactionsArray);
        } catch (error) {
          console.error('Error in transactions listener callback:', error);
        }
      });
      
      console.log('Transactions listener set up for user:', userId);
      return this.transactionsListener;
    } catch (error) {
      console.error('Error setting up transactions listener:', error);
      throw new Error(`Failed to set up transactions listener: ${error.message}`);
    }
  }

  // Remove listeners
  removePersonsListener() {
    try {
      if (this.personsListener) {
        const userId = this.getCurrentUserId();
        dbHelpers.removePersonsListener(userId);
        this.personsListener = null;
        console.log('Persons listener removed for user:', userId);
      }
    } catch (error) {
      console.error('Error removing persons listener:', error);
    }
  }

  removeTransactionsListener() {
    try {
      if (this.transactionsListener) {
        const userId = this.getCurrentUserId();
        dbHelpers.removeTransactionsListener(userId);
        this.transactionsListener = null;
        console.log('Transactions listener removed for user:', userId);
      }
    } catch (error) {
      console.error('Error removing transactions listener:', error);
    }
  }

  listenToCategories(callback) {
    try {
      if (typeof callback !== 'function') {
        throw new Error('Callback function is required');
      }

      const userId = this.getCurrentUserId();
      
      this.categoriesListener = dbHelpers.listenToCategories(userId, (snapshot) => {
        try {
          const categories = snapshot.val() || {};
          const categoriesArray = Object.keys(categories).map(id => ({
            id,
            ...categories[id],
          }));
          
          // If no custom categories, return default categories
          if (categoriesArray.length === 0) {
            callback(this.getDefaultCategories());
          } else {
            callback(categoriesArray);
          }
        } catch (error) {
          console.error('Error in categories listener callback:', error);
        }
      });
      
      console.log('Categories listener set up for user:', userId);
      return this.categoriesListener;
    } catch (error) {
      console.error('Error setting up categories listener:', error);
      throw new Error(`Failed to set up categories listener: ${error.message}`);
    }
  }

  removeCategoriesListener() {
    try {
      if (this.categoriesListener) {
        const userId = this.getCurrentUserId();
        dbHelpers.removeCategoriesListener(userId);
        this.categoriesListener = null;
        console.log('Categories listener removed for user:', userId);
      }
    } catch (error) {
      console.error('Error removing categories listener:', error);
    }
  }

  // Clean up all listeners
  cleanup() {
    try {
      this.removePersonsListener();
      this.removeTransactionsListener();
      this.removeCategoriesListener();
      console.log('Data service cleanup completed');
    } catch (error) {
      console.error('Error during data service cleanup:', error);
    }
  }

  // UTILITY METHODS
  async getPersonsWithTransactions() {
    try {
      console.log('getPersonsWithTransactions called');
      
      // Ensure service is initialized
      this.ensureInitialized();
      
      const userId = this.getCurrentUserId();
      console.log('Current user ID:', userId);
      
      const [persons, transactions] = await Promise.all([
        this.getPersons(),
        this.getTransactions(),
      ]);
      
      console.log('Raw persons data:', persons);
      console.log('Raw transactions data:', transactions);
      
      // Ensure we have valid arrays
      if (!Array.isArray(persons) || !Array.isArray(transactions)) {
        console.error('Invalid data received - persons:', persons, 'transactions:', transactions);
        return [];
      }
      
      // Calculate balances and stats for each person
      const personsWithStats = persons.map(person => {
        console.log('Processing person:', person);
        console.log('Person ID:', person.id);
        console.log('Person ID type:', typeof person.id);
        
        const personTransactions = transactions.filter(t => t.personId === person.id);
        console.log('Person transactions for', person.id, ':', personTransactions);
        
        const totalIncome = personTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        const totalExpenses = personTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        const balance = totalIncome - totalExpenses;
        
        const result = {
          ...person,
          balance,
          totalIncome,
          totalExpenses,
          transactionCount: personTransactions.length,
        };
        
        console.log('Person with stats:', result);
        return result;
      });
      
      console.log('Final persons with stats:', personsWithStats);
      return personsWithStats;
    } catch (error) {
      console.error('Error getting persons with transactions:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }

  async getDashboardStats() {
    try {
      const [persons, transactions] = await Promise.all([
        this.getPersons(),
        this.getTransactions(),
      ]);
      
      // Validate that we have valid arrays
      if (!Array.isArray(persons) || !Array.isArray(transactions)) {
        console.warn('getDashboardStats: Invalid data received, returning default stats');
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netCashflow: 0,
          totalPersons: 0,
          totalTransactions: 0,
          monthlyData: [],
          categoryData: [],
        };
      }
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      const netCashflow = totalIncome - totalExpenses;
      
      // Monthly breakdown (last 6 months) - only if we have transactions
      const monthlyData = transactions.length > 0 ? this.calculateMonthlyBreakdown(transactions) : [];
      
      // Category breakdown - only if we have transactions
      const categoryData = transactions.length > 0 ? this.calculateCategoryBreakdown(transactions) : [];
      
      return {
        totalIncome,
        totalExpenses,
        netCashflow,
        totalPersons: persons.length,
        totalTransactions: transactions.length,
        monthlyData,
        categoryData,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Return default stats instead of throwing error
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netCashflow: 0,
        totalPersons: 0,
        totalTransactions: 0,
        monthlyData: [],
        categoryData: [],
      };
    }
  }

  calculateMonthlyBreakdown(transactions) {
    try {
      // Validate input
      if (!transactions || !Array.isArray(transactions)) {
        console.warn('calculateMonthlyBreakdown: Invalid transactions parameter:', transactions);
        return [];
      }
      
      console.log('calculateMonthlyBreakdown: Processing', transactions.length, 'transactions');
      
      const months = {};
      const now = new Date();
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        months[monthKey] = { income: 0, expenses: 0, net: 0 };
      }
      
      console.log('calculateMonthlyBreakdown: Initialized months:', Object.keys(months));
      
      transactions.forEach((transaction, index) => {
        console.log(`Transaction ${index} full data:`, transaction);
        
        if (transaction && transaction.date && transaction.type && transaction.amount) {
          try {
            // Validate date format
            const dateStr = String(transaction.date);
            console.log(`Transaction ${index}: Raw date value:`, transaction.date, 'Type:', typeof transaction.date);
            
            let monthKey;
            if (dateStr.includes('-') && dateStr.length >= 7) {
              monthKey = dateStr.slice(0, 7);
            } else if (dateStr.includes('/') && dateStr.length >= 7) {
              // Handle MM/DD/YYYY format
              const dateParts = dateStr.split('/');
              if (dateParts.length === 3) {
                monthKey = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}`;
              }
            } else {
              console.log(`Transaction ${index}: Invalid date format:`, dateStr);
              return;
            }
            
            console.log(`Transaction ${index}: Processed monthKey:`, monthKey);
            
            if (months[monthKey]) {
              const amount = parseFloat(transaction.amount) || 0;
              if (transaction.type === 'income') {
                months[monthKey].income += amount;
                console.log(`Added income ${amount} to month ${monthKey}, total: ${months[monthKey].income}`);
              } else if (transaction.type === 'expense') {
                months[monthKey].expenses += amount;
                console.log(`Added expense ${amount} to month ${monthKey}, total: ${months[monthKey].expenses}`);
              }
              months[monthKey].net = months[monthKey].income - months[monthKey].expenses;
            } else {
              console.log(`Month key ${monthKey} not found in months object. Available months:`, Object.keys(months));
            }
          } catch (error) {
            console.warn('Error processing transaction in monthly breakdown:', error, transaction);
          }
        } else {
          console.log(`Transaction ${index} missing required fields:`, {
            hasDate: !!transaction?.date,
            hasType: !!transaction?.type,
            hasAmount: !!transaction?.amount,
            dateValue: transaction?.date,
            typeValue: transaction?.type,
            amountValue: transaction?.amount,
            transaction
          });
        }
      });
      
      const result = Object.keys(months).map(month => ({
        month,
        ...months[month],
      }));
      
      console.log('calculateMonthlyBreakdown: Final result:', result);
      console.log('calculateMonthlyBreakdown: Summary of all months:', months);
      console.log('calculateMonthlyBreakdown: Total transactions processed:', transactions.length);
      console.log('calculateMonthlyBreakdown: Transactions with valid data:', transactions.filter(t => t && t.date && t.type && t.amount).length);
      
      return result;
    } catch (error) {
      console.error('Error calculating monthly breakdown:', error);
      return [];
    }
  }

  calculateCategoryBreakdown(transactions) {
    try {
      // Validate input
      if (!transactions || !Array.isArray(transactions)) {
        console.warn('calculateCategoryBreakdown: Invalid transactions parameter:', transactions);
        return [];
      }
      
      const categories = {};
      
      transactions.forEach(transaction => {
        if (transaction && transaction.type && transaction.amount) {
          try {
            const category = transaction.category || 'Other';
            if (!categories[category]) {
              categories[category] = { income: 0, expenses: 0, count: 0 };
            }
            
            const amount = parseFloat(transaction.amount) || 0;
            if (transaction.type === 'income') {
              categories[category].income += amount;
            } else if (transaction.type === 'expense') {
              categories[category].expenses += amount;
            }
            categories[category].count += 1;
          } catch (error) {
            console.warn('Error processing transaction in category breakdown:', error, transaction);
          }
        }
      });
      
      return Object.keys(categories).map(category => ({
        category,
        ...categories[category],
        total: categories[category].income + categories[category].expenses,
      }));
    } catch (error) {
      console.error('Error calculating category breakdown:', error);
      return [];
    }
  }
}

export default new DataService();