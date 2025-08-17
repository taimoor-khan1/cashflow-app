import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, MOCK_DATA } from '../constants';
import TransactionItem from '../components/TransactionItem';
import CustomDropdown from '../components/CustomDropdown';
import Card from '../components/Card';
import ImageViewer from '../components/ImageViewer';

const TransactionsListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...MOCK_DATA.TRANSACTIONS];

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(transaction => 
        transaction.notes.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.personName.toLowerCase().includes(searchText.toLowerCase())
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

    // Filter by person
    if (selectedPerson) {
      filtered = filtered.filter(transaction => transaction.personId === selectedPerson);
    }

    // Filter by date range (simplified - you can enhance this)
    if (dateRange) {
      const today = new Date();
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= cutoffDate;
      });
    }

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'person':
          return a.personName.localeCompare(b.personName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchText, selectedType, selectedCategory, selectedPerson, dateRange, sortBy]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedPerson('');
    setDateRange('');
    setSortBy('date');
  };

  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
    setShowImageViewer(true);
  };

  const getTransactionStats = () => {
    const total = filteredTransactions.length;
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { total, income, expenses };
  };

  const stats = getTransactionStats();

  const renderTransactionItem = ({ item }) => (
    <TransactionItem
      id={item.id}
      type={item.type}
      amount={item.amount}
      category={item.category}
      notes={item.notes}
      date={item.date}
      personName={item.personName}
      attachment={item.attachment}
      onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
      onAttachmentPress={() => item.attachment && handleAttachmentPress(item.attachment)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Icon name="add" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: COLORS.INCOME }]}>
            ${stats.income.toFixed(2)}
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={[styles.statValue, { color: COLORS.EXPENSE }]}>
            ${stats.expenses.toFixed(2)}
          </Text>
        </Card>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.TEXT_SECONDARY} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close" size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <CustomDropdown
          label="Type"
          value={selectedType}
          onValueChange={setSelectedType}
          items={['', 'income', 'expense']}
          placeholder="All Types"
          containerStyle={styles.filterDropdown}
        />
        
        <CustomDropdown
          label="Category"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          items={['', ...MOCK_DATA.CATEGORIES]}
          placeholder="All Categories"
          containerStyle={styles.filterDropdown}
        />
        
        <CustomDropdown
          label="Person"
          value={selectedPerson}
          onValueChange={setSelectedPerson}
          items={[{ id: '', name: 'All People' }, ...MOCK_DATA.PERSONS.map(p => ({ id: p.id, name: p.name }))]}
          placeholder="All People"
          containerStyle={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          label="Date Range"
          value={dateRange}
          onValueChange={setDateRange}
          items={[
            { id: '', name: 'All Time' },
            { id: '7', name: 'Last 7 days' },
            { id: '30', name: 'Last 30 days' },
            { id: '90', name: 'Last 3 months' },
            { id: '365', name: 'Last year' }
          ]}
          placeholder="All Time"
          containerStyle={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
        
        <CustomDropdown
          label="Sort By"
          value={sortBy}
          onValueChange={setSortBy}
          items={[
            { id: 'date', name: 'Date' },
            { id: 'amount', name: 'Amount' },
            { id: 'category', name: 'Category' },
            { id: 'person', name: 'Person' }
          ]}
          placeholder="Sort By"
          containerStyle={styles.filterDropdown}
          displayKey="name"
          valueKey="id"
        />
      </ScrollView>

      {/* Clear Filters Button */}
      {(selectedType || selectedCategory || selectedPerson || dateRange) && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Icon name="clear" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id.toString()}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color={COLORS.TEXT_TERTIARY} />
            <Text style={styles.emptyStateTitle}>No transactions found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters or add a new transaction
            </Text>
          </View>
        }
      />
      
      {/* Image Viewer Modal */}
      {showImageViewer && selectedAttachment && (
        <ImageViewer
          imageUri={selectedAttachment.uri}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedAttachment(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.FULL,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SPACING.MD,
    gap: SPACING.SM,
  },
  statCard: {
    flex: 1,
    padding: SPACING.MD,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.SM,
  },
  searchIcon: {
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    color: COLORS.TEXT_PRIMARY,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  filterDropdown: {
    marginRight: SPACING.MD,
    minWidth: 120,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  clearFiltersText: {
    marginLeft: SPACING.XS,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XL,
    marginTop: SPACING.XL,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
});

export default TransactionsListScreen;
