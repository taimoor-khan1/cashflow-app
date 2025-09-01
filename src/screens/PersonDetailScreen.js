import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { formatCurrency } from '../utils';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import ImageViewer from '../components/ImageViewer';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../navigation/AppNavigator';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import dataService from '../services/dataService';

const PersonDetailScreen = ({ navigation, route }) => {
  console.log('PersonDetailScreen: Component rendering...');
  
  const { personId } = route.params;
  console.log('PersonDetailScreen: personId from route:', personId);
  
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { 
    persons, 
    transactions, 
    loading, 
    error: hookError, 
    refreshData 
  } = useRealTimeData();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Get person and their transactions from the hook data
  const person = persons.find(p => p.id === personId);
  const personTransactions = transactions.filter(t => t.personId === personId);
  
  // Add safety check for personId
  if (!personId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid account ID</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  useEffect(() => {
    console.log('PersonDetailScreen: useEffect triggered with personId:', personId);
    loadCategories();
  }, [personId]);

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

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction', { personId });
  };

  const handleEditPerson = () => {
    navigation.navigate('EditAccount', { personId: person.id });
  };

  const handleDeletePerson = () => {
    setShowDeleteModal(true);
  };

  const confirmDeletePerson = async () => {
    try {
      // Import dataService here to avoid circular dependencies
      const dataService = require('../services/dataService').default;
      await dataService.deletePerson(personId);
      showSuccess('Account deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting person:', error);
      showError('Failed to delete account. Please try again.');
    }
  };

  const handleTransactionPress = (transactionId) => {
    // Validate transaction ID before navigation
    if (!transactionId) {
      console.error('Invalid transaction ID:', transactionId);
      showError('Invalid transaction selected. Please try again.');
      return;
    }
    
    console.log('Navigating to transaction detail with ID:', transactionId);
    // Navigate to transaction detail or edit
    navigation.navigate('TransactionDetail', { transactionId });
  };

  const handleAttachmentPress = (attachment) => {
    // Validate attachment before showing image viewer
    if (!attachment) {
      console.error('Invalid attachment:', attachment);
      return;
    }
    
    setSelectedAttachment(attachment);
    setShowImageViewer(true);
  };

  const getBalanceColor = (balance) => (balance >= 0 ? COLORS.SUCCESS : COLORS.ERROR);
  const getBalancePrefix = (balance) => (balance >= 0 ? '+' : '');

  // Show error state
  if (hookError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
            <Text style={styles.headerTitle}>Account Details</Text>
            <View style={styles.placeholderButton} />
          </View>
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{hookError}</Text>
          <CustomButton
            title="Try Again"
            onPress={refreshData}
            style={styles.errorButton}
          />
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={[styles.errorButton, { marginTop: 10 }]}
          />
        </View>
      </View>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
            <Text style={styles.headerTitle}>Account Details</Text>
            <View style={styles.placeholderButton} />
          </View>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading account details...</Text>
        </View>
      </View>
    );
  }

  // Show person not found state
  if (!person) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
            <Text style={styles.headerTitle}>Account Details</Text>
            <View style={styles.placeholderButton} />
          </View>
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Account not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  // Calculate person stats
  const totalIncome = personTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  
  const totalExpenses = personTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  
  const balance = totalIncome - totalExpenses;

  console.log('PersonDetailScreen: Rendering main component');
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
          <Text style={styles.headerTitle}>{person.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleEditPerson}
            >
              <Icon name="edit" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleDeletePerson}
            >
              <Icon name="delete" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {person.notes || 'No notes available'}
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
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: getBalanceColor(balance) }]}>
            {getBalancePrefix(balance)}{formatCurrency(Math.abs(balance))}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="trending-up" size={24} color={COLORS.SUCCESS} />
            <Text style={styles.statValue}>{formatCurrency(totalIncome)}</Text>
            <Text style={styles.statLabel}>Total Income</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="trending-down" size={24} color={COLORS.ERROR} />
            <Text style={styles.statValue}>{formatCurrency(totalExpenses)}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="receipt" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.statValue}>{personTransactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <CustomButton
            title="Add Transaction"
            onPress={handleAddTransaction}
            style={styles.addTransactionButton}
            icon={
              <Icon
                name="add"
                size={24}
                color={COLORS.WHITE}
                style={styles.buttonIcon}
              />
            }
          />
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Transactions ({personTransactions.length})
            </Text>
          </View>
          
          {personTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {(() => {
                console.log('PersonDetailScreen: Rendering transactions, count:', personTransactions.length);
                try {
                  return personTransactions
                    .filter(transaction => {
                      const isValid = transaction && transaction.id && transaction.type;
                      if (!isValid) {
                        console.warn('PersonDetailScreen: Filtering out invalid transaction:', transaction);
                      }
                      return isValid;
                    })
                    .sort((a, b) => {
                      try {
                        const dateA = new Date(a.date || 0);
                        const dateB = new Date(b.date || 0);
                        return dateB - dateA;
                      } catch (error) {
                        console.warn('PersonDetailScreen: Error sorting transaction dates:', error);
                        return 0;
                      }
                    })
                    .slice(0, 10)
                    .map((transaction, index) => {
                      console.log(`PersonDetailScreen: Rendering transaction ${index}:`, transaction.id, transaction.type);
                      
                      // Additional safety check for each transaction
                      if (!transaction || !transaction.id || !transaction.type) {
                        console.warn('PersonDetailScreen: Skipping invalid transaction:', transaction);
                        return null;
                      }
                      
                      try {
                        return (
                          <TransactionItem
                            key={transaction.id}
                            id={transaction.id}
                            type={transaction.type}
                            amount={transaction.amount || 0}
                            category={transaction.category || 'Other'}
                            notes={transaction.notes || ''}
                            date={transaction.date || new Date().toISOString().split('T')[0]}
                            personName={transaction.personName || person?.name || 'Unknown'}
                            attachment={transaction.attachment}
                            categories={categories}
                            onPress={() => handleTransactionPress(transaction.id)}
                            onAttachmentPress={handleAttachmentPress}
                          />
                        );
                      } catch (error) {
                        console.error('PersonDetailScreen: Error rendering TransactionItem:', error, transaction);
                        return null;
                      }
                    })
                    .filter(Boolean);
                } catch (error) {
                  console.error('PersonDetailScreen: Error in transactions rendering logic:', error);
                  return null;
                }
              })()}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Icon name="receipt" size={48} color={COLORS.GRAY_400} />
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
              <Text style={styles.emptyTransactionsSubtext}>
                Add your first transaction to start tracking
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      {showImageViewer && selectedAttachment && (
        <ImageViewer
          visible={showImageViewer}
          imageUri={selectedAttachment}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        message={`Are you sure you want to delete ${person?.name}? This will also delete all associated transactions.`}
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={confirmDeletePerson}
        onCancel={() => setShowDeleteModal(false)}
      />
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
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  headerButton: {
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
  balanceCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,
    marginBottom: SPACING.LG,
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: SPACING.LG,
  },
  addTransactionButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonIcon: {
    marginRight: SPACING.SM,
  },
  transactionsSection: {
    marginBottom: SPACING.LG,
  },
  sectionHeader: {
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  transactionsList: {
    gap: SPACING.MD,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: SPACING.XL,
  },
  emptyTransactionsText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  emptyTransactionsSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.ERROR,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  errorButtonText: {
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
  placeholderButton: {
    width: 40,
    height: 40,
  },
});

export default PersonDetailScreen;
