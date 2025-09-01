import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import TransactionItem from '../components/TransactionItem';
import CustomDropdown from '../components/CustomDropdown';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../navigation/AppNavigator';

const TransactionsListScreen = ({ navigation }) => {
  console.log('TransactionsListScreen: Component rendering...');
  
  const { currentUser } = useAuth();
  const insets = useSafeAreaInsets();
  console.log('TransactionsListScreen: currentUser:', currentUser);
  
  const { 
    transactions, 
    persons, 
    loading, 
    error, 
    refreshData 
  } = useRealTimeData();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log('TransactionsListScreen: useEffect triggered');
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesList = await dataService.getCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    console.log('TransactionsListScreen: useMemo filteredTransactions triggered');
    console.log('TransactionsListScreen: transactions array:', transactions);
    console.log('TransactionsListScreen: transactions length:', transactions.length);
    
    try {
      let filtered = [...transactions];

      // Filter by search text
      if (searchText.trim()) {
        filtered = filtered.filter(transaction => 
          transaction.notes?.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.category?.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.personName?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Filter by type
      if (selectedType) {
        filtered = filtered.filter(transaction => transaction.type === selectedType);
      }

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(transaction => transaction.category === selectedCategory);
      }

      // Filter by account
      if (selectedAccount) {
        filtered = filtered.filter(transaction => transaction.personId === selectedAccount);
      }

      // Filter by date range (simplified - you can enhance this)
      if (dateRange) {
        const today = new Date();
        const daysAgo = parseInt(dateRange);
        const cutoffDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        filtered = filtered.filter(transaction => {
          if (!transaction.date) return false;
          try {
            const transactionDate = new Date(transaction.date);
            return !isNaN(transactionDate.getTime()) && transactionDate >= cutoffDate;
          } catch (error) {
            console.warn('Invalid date in transaction:', transaction.date);
            return false;
          }
        });
      }

      // Sort transactions
      filtered.sort((a, b) => {
        try {
          switch (sortBy) {
            case 'date':
              const dateA = new Date(a.date || 0);
              const dateB = new Date(b.date || 0);
              return dateB - dateA;
            case 'amount':
              return (b.amount || 0) - (a.amount || 0);
            case 'category':
              return (a.category || '').localeCompare(b.category || '');
            case 'account':
              return (a.personName || '').localeCompare(b.personName || '');
            default:
              return 0;
          }
        } catch (error) {
          console.warn('Error sorting transactions:', error);
          return 0;
        }
      });

      console.log('TransactionsListScreen: filtered transactions result:', filtered);
      return filtered;
    } catch (error) {
      console.error('TransactionsListScreen: Error in filteredTransactions useMemo:', error);
      return [];
    }
  }, [transactions, searchText, selectedType, selectedCategory, selectedAccount, dateRange, sortBy, categories]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedAccount('');
    setDateRange('');
    setSortBy('date');
  };

  const handleAttachmentPress = (attachment) => {
    // Validate attachment before showing image viewer
    if (!attachment) {
      console.error('Invalid attachment in TransactionsListScreen:', attachment);
      return;
    }
    
    setSelectedAttachment(attachment);
    setShowImageViewer(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
      </View>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your cash flow by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.emptyButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.GRAY_400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.GRAY_400}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close" size={20} color={COLORS.GRAY_400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <CustomDropdown
          items={[
            { id: '', name: 'All Types' },
            { id: 'income', name: 'Income' },
            { id: 'expense', name: 'Expense' },
          ]}
          value={selectedType}
          onValueChange={(value) => {
            try {
              console.log('TransactionsListScreen: Type filter changed to:', value);
              setSelectedType(value);
            } catch (error) {
              console.error('TransactionsListScreen: Error setting type filter:', error);
            }
          }}
          placeholder="Type"
          style={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          items={[
            { id: '', name: 'All Categories' },
            ...categories.map(category => ({
              id: category.id,
              name: category.name,
              color: category.color,
              icon: category.icon
            }))
          ]}
          value={selectedCategory}
          onValueChange={(value) => {
            try {
              console.log('TransactionsListScreen: Category filter changed to:', value);
              setSelectedCategory(value);
            } catch (error) {
              console.error('TransactionsListScreen: Error setting category filter:', error);
            }
          }}
          placeholder="Category"
          style={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          items={[
            { id: '', name: 'All People' },
            ...(() => {
              try {
                console.log('TransactionsListScreen: Filtering persons for dropdown, count:', persons?.length);
                const validPersons = persons
                  .filter(person => {
                    const isValid = person && person.id && person.name && typeof person.id === 'string' && typeof person.name === 'string';
                    if (!isValid) {
                      console.warn('TransactionsListScreen: Invalid person object:', person);
                    }
                    return isValid;
                  })
                  .map(person => ({ id: person.id, name: person.name }));
                console.log('TransactionsListScreen: Valid persons for dropdown:', validPersons.length);
                return validPersons;
              } catch (error) {
                console.error('TransactionsListScreen: Error filtering persons for dropdown:', error);
                return [];
              }
            })(),
          ]}
          value={selectedAccount}
          onValueChange={(value) => {
            try {
              console.log('TransactionsListScreen: Account filter changed to:', value);
              setSelectedAccount(value);
            } catch (error) {
              console.error('TransactionsListScreen: Error setting account filter:', error);
            }
          }}
          placeholder="Account"
          style={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          items={[
            { id: '', name: 'All Time' },
            { id: '7', name: 'Last 7 days' },
            { id: '30', name: 'Last 30 days' },
            { id: '90', name: 'Last 90 days' },
          ]}
          value={dateRange}
          onValueChange={(value) => {
            try {
              console.log('TransactionsListScreen: Date range filter changed to:', value);
              setDateRange(value);
            } catch (error) {
              console.error('TransactionsListScreen: Error setting date range filter:', error);
            }
          }}
          placeholder="Date Range"
          style={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          items={[
            { id: 'date', name: 'Sort by Date' },
            { id: 'amount', name: 'Sort by Amount' },
            { id: 'category', name: 'Sort by Category' },
            { id: 'account', name: 'Sort by Account' },
          ]}
          value={sortBy}
          onValueChange={(value) => {
            try {
              console.log('TransactionsListScreen: Sort by filter changed to:', value);
              setSortBy(value);
            } catch (error) {
              console.error('TransactionsListScreen: Error setting sort by filter:', error);
            }
          }}
          placeholder="Sort By"
          style={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
      </ScrollView>

      {/* Clear Filters */}
      {(searchText || selectedType || selectedCategory || selectedAccount || dateRange) && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Icon name="clear" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={COLORS.GRADIENT_PRIMARY}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transactions</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Icon name="add" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  try {
    console.log('TransactionsListScreen: Rendering main component');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Gradient Header */}
        <LinearGradient
          colors={COLORS.GRADIENT_PRIMARY}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transactions</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Icon name="add" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.headerSubtitle}>
            Track all your income and expenses
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderFilters()}

          {filteredTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {(() => {
                console.log('TransactionsListScreen: Rendering transactions, count:', filteredTransactions.length);
                return filteredTransactions
                  .filter(transaction => {
                    const isValid = transaction && transaction.id && transaction.type;
                    if (!isValid) {
                      console.warn('Filtering out invalid transaction:', transaction);
                    }
                    return isValid;
                  })
                  .map((transaction, index) => {
                    // Additional safety check for each transaction
                    if (!transaction || !transaction.id || !transaction.type) {
                      console.warn('Skipping invalid transaction in TransactionsListScreen:', transaction);
                      return null;
                    }
                    
                    try {
                      return (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          categories={categories}
                          onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
                          onAttachmentPress={handleAttachmentPress}
                        />
                      );
                    } catch (error) {
                      console.error('TransactionsListScreen: Error rendering TransactionItem:', error, transaction);
                      return null;
                    }
                  })
                  .filter(Boolean);
              })()}
            </View>
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      </View>
    );
  } catch (error) {
    console.error('TransactionsListScreen: Critical error in main render:', error);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={COLORS.GRADIENT_PRIMARY}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transactions</Text>
            <View style={styles.addButton} />
          </View>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Error loading transactions. Please try again.</Text>
          <TouchableOpacity
            style={[styles.emptyButton, { marginTop: 20 }]}
            onPress={() => {
              // Trigger refresh
              onRefresh();
            }}
          >
            <Text style={styles.emptyButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: SPACING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
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
  addButton: {
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
    padding: SPACING.LG,
  },
  filtersContainer: {
    marginBottom: SPACING.LG,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.SMALL,
  },
  searchIcon: {
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  filterScroll: {
    marginBottom: SPACING.MD,
  },
  filterDropdown: {
    marginRight: SPACING.MD,
    minWidth: 120,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  clearFiltersText: {
    marginLeft: SPACING.XS,
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  transactionsList: {
    backgroundColor: COLORS.WHITE,
    // borderRadius: 16,
    // padding: 16,
    // ...SHADOWS.MD,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.LG,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.MD,
  },
  emptyButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default TransactionsListScreen;
