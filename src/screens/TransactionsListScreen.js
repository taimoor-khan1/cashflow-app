import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, MOCK_DATA } from '../constants';
import TransactionItem from '../components/TransactionItem';
import CustomDropdown from '../components/CustomDropdown';

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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="receipt" size={64} color={COLORS.GRAY_400} />
      <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        Try adjusting your filters or add a new transaction
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Icon name="add" size={20} color={COLORS.WHITE} />
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        style={styles.header}
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
            style={styles.headerAddButton}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Icon name="add" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.GRAY_500} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={COLORS.GRAY_400}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close" size={20} color={COLORS.GRAY_500} />
              </TouchableOpacity>
            )}
          </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              {/* Row 1 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
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
              </ScrollView>
              
              {/* Row 2 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
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
            </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {filteredTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
                  onAttachmentPress={handleAttachmentPress}
                />
              ))}
            </View>
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  headerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchSection: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    margin: 20,
    borderRadius: 20,
    ...SHADOWS.MD,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  filtersContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filterDropdown: {
    marginRight: 16,
    minWidth: 140,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'center',
    marginTop: 8,
  },
  clearFiltersText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  transactionsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
});

export default TransactionsListScreen;
