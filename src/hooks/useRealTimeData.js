import { useState, useEffect, useRef, useCallback } from 'react';
import dataService from '../services/dataService';
import { useAuth } from '../navigation/AppNavigator';

export const useRealTimeData = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    persons: [],
    transactions: [],
    personsWithStats: [],
    dashboardStats: {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      totalPersons: 0,
      totalTransactions: 0,
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const listenersRef = useRef({
    persons: null,
    transactions: null,
  });
  
  const isInitializedRef = useRef(false);
  const currentDataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    currentDataRef.current = data;
  }, [data]);

  // Calculate persons with stats
  const calculatePersonsWithStats = useCallback((persons, transactions) => {
    try {
      if (!persons || !Array.isArray(persons) || !transactions || !Array.isArray(transactions)) {
        return [];
      }

      return persons.map(person => {
        const personTransactions = transactions.filter(t => t.personId === person.id);
        
        const totalIncome = personTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        const totalExpenses = personTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        const balance = totalIncome - totalExpenses;
        
        return {
          ...person,
          balance,
          totalIncome,
          totalExpenses,
          transactionCount: personTransactions.length,
        };
      });
    } catch (error) {
      console.error('Error calculating persons with stats:', error);
      return persons || [];
    }
  }, []);

  // Calculate dashboard stats
  const calculateDashboardStats = useCallback((persons, transactions) => {
    try {
      if (!persons || !Array.isArray(persons) || !transactions || !Array.isArray(transactions)) {
        return {
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          totalPersons: 0,
          totalTransactions: 0,
        };
      }

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      const totalBalance = totalIncome - totalExpenses;
      
      return {
        totalBalance,
        totalIncome,
        totalExpenses,
        totalPersons: persons.length,
        totalTransactions: transactions.length,
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalPersons: 0,
        totalTransactions: 0,
      };
    }
  }, []);

  // Update all data when either persons or transactions change
  const updateAllData = useCallback((newPersons, newTransactions) => {
    try {
      console.log('useRealTimeData: Updating all data');
      console.log('New persons count:', newPersons?.length);
      console.log('New transactions count:', newTransactions?.length);
      
      const personsWithStats = calculatePersonsWithStats(newPersons, newTransactions);
      const dashboardStats = calculateDashboardStats(newPersons, newTransactions);
      
      setData({
        persons: newPersons || [],
        transactions: newTransactions || [],
        personsWithStats,
        dashboardStats,
      });
      
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error updating all data:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [calculatePersonsWithStats, calculateDashboardStats]);

  // Setup real-time listeners - FIXED: No dependencies that cause infinite loops
  const setupRealTimeListeners = useCallback(() => {
    try {
      console.log('useRealTimeData: Setting up real-time listeners');
      
      // Clean up existing listeners
      if (listenersRef.current.persons) {
        dataService.removePersonsListener();
        listenersRef.current.persons = null;
      }
      if (listenersRef.current.transactions) {
        dataService.removeTransactionsListener();
        listenersRef.current.transactions = null;
      }

      // Listen to persons changes - use ref to get current data
      listenersRef.current.persons = dataService.listenToPersons((updatedPersons) => {
        console.log('useRealTimeData: Persons updated via listener:', updatedPersons?.length);
        const currentTransactions = currentDataRef.current.transactions;
        updateAllData(updatedPersons, currentTransactions);
      });

      // Listen to transactions changes - use ref to get current data
      listenersRef.current.transactions = dataService.listenToTransactions((updatedTransactions) => {
        console.log('useRealTimeData: Transactions updated via listener:', updatedTransactions?.length);
        const currentPersons = currentDataRef.current.persons;
        updateAllData(currentPersons, updatedTransactions);
      });

      console.log('useRealTimeData: Real-time listeners set up successfully');
    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [updateAllData]); // Only depends on updateAllData, not on data state

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      console.log('useRealTimeData: Loading initial data');
      setLoading(true);
      setError(null);

      const [personsData, transactionsData] = await Promise.all([
        dataService.getPersons(),
        dataService.getTransactions(),
      ]);

      console.log('useRealTimeData: Initial data loaded');
      console.log('Persons count:', personsData?.length);
      console.log('Transactions count:', transactionsData?.length);

      updateAllData(personsData, transactionsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [updateAllData]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    try {
      console.log('useRealTimeData: Refreshing data manually');
      await loadInitialData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error.message);
    }
  }, [loadInitialData]);

  // Initialize hook
  useEffect(() => {
    if (!currentUser?.uid || isInitializedRef.current) {
      return;
    }

    console.log('useRealTimeData: Initializing with user:', currentUser.uid);
    isInitializedRef.current = true;

    const initialize = async () => {
      try {
        await loadInitialData();
        setupRealTimeListeners();
      } catch (error) {
        console.error('Error initializing useRealTimeData:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      console.log('useRealTimeData: Cleaning up listeners');
      if (listenersRef.current.persons) {
        dataService.removePersonsListener();
        listenersRef.current.persons = null;
      }
      if (listenersRef.current.transactions) {
        dataService.removeTransactionsListener();
        listenersRef.current.transactions = null;
      }
      isInitializedRef.current = false;
    };
  }, [currentUser?.uid, loadInitialData, setupRealTimeListeners]);

  // Reset initialization when user changes
  useEffect(() => {
    if (currentUser?.uid) {
      isInitializedRef.current = false;
    }
  }, [currentUser?.uid]);

  return {
    // Data
    persons: data.persons,
    transactions: data.transactions,
    personsWithStats: data.personsWithStats,
    dashboardStats: data.dashboardStats,
    
    // State
    loading,
    error,
    
    // Actions
    refreshData,
    
    // Utility functions
    getPersonById: (id) => data.persons.find(p => p.id === id),
    getTransactionById: (id) => data.transactions.find(t => t.id === id),
    getTransactionsByPersonId: (personId) => data.transactions.filter(t => t.personId === personId),
  };
};
