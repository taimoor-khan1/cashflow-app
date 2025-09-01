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
import ImageViewer from '../components/ImageViewer';
import Modal from '../components/Modal';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../navigation/AppNavigator';
import { useToast } from '../contexts/ToastContext';
import dataService from '../services/dataService';
import { resolveCategoryName } from '../utils';

const TransactionDetailScreen = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { 
    transactions, 
    persons, 
    loading, 
    error: hookError, 
    refreshData 
  } = useRealTimeData();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Get transaction and person from the hook data
  const transaction = transactions.find(t => t.id === transactionId);
  const person = transaction ? persons.find(p => p.id === transaction.personId) : null;

  useEffect(() => {
    if (transactionId) {
      console.log('TransactionDetailScreen: useEffect triggered with transactionId:', transactionId);
      loadCategories();
    }
  }, [transactionId]);

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

  const handleEditTransaction = () => {
    navigation.navigate('AddTransaction', { 
      transactionId,
      person: person,
      isEditing: true 
    });
  };

  const handleDeleteTransaction = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteTransaction = async () => {
    try {
      // Import dataService here to avoid circular dependencies
      const dataService = require('../services/dataService').default;
      await dataService.deleteTransaction(transactionId);
      showSuccess('Transaction deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError('Failed to delete transaction. Please try again.');
    }
  };

  const handleAttachmentPress = () => {
    if (transaction?.attachment) {
      console.log('TransactionDetailScreen - Attachment data:', transaction.attachment);
      console.log('TransactionDetailScreen - Attachment type:', typeof transaction.attachment);
      console.log('TransactionDetailScreen - Attachment keys:', Object.keys(transaction.attachment || {}));
      setSelectedAttachment(transaction.attachment);
      setShowImageViewer(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? 'trending-up' : 'trending-down';
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? COLORS.SUCCESS : COLORS.ERROR;
  };

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
            <Text style={styles.headerTitle}>Transaction Details</Text>
            <View style={styles.headerActions} />
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
            <Text style={styles.headerTitle}>Loading...</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon name="edit" size={24} color={COLORS.WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Icon name="delete" size={24} color={COLORS.WHITE} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transaction details...</Text>
        </View>
      </View>
    );
  }

  if (!transaction) {
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
            <Text style={styles.headerTitle}>Transaction Not Found</Text>
            <View style={styles.headerActions} />
          </View>
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleEditTransaction}
            >
              <Icon name="edit" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleDeleteTransaction}
            >
              <Icon name="delete" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Transaction Card */}
        <View style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <View style={[
              styles.transactionIcon,
              { backgroundColor: getTransactionColor(transaction.type) + '20' }
            ]}>
              <Icon
                name={getTransactionIcon(transaction.type)}
                size={32}
                color={getTransactionColor(transaction.type)}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </Text>
              <Text style={[
                styles.transactionAmount,
                { color: getTransactionColor(transaction.type) }
              ]}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Icon name="category" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{resolveCategoryName(transaction.category, categories) || 'Other'}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Icon name="account-balance" size={24} color={COLORS.SECONDARY} />
            <Text style={styles.detailLabel}>Account</Text>
            <Text style={styles.detailValue}>{person?.name || 'Unknown'}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Icon name="event" size={24} color={COLORS.INFO} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Icon name="schedule" size={24} color={COLORS.WARNING} />
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {transaction.createdAt ? formatDate(transaction.createdAt) : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Notes Section */}
        {transaction.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{transaction.notes}</Text>
            </View>
          </View>
        )}

        {/* Attachment Section */}
        {transaction.attachment && (
          <View style={styles.attachmentSection}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            <TouchableOpacity
              style={styles.attachmentCard}
              onPress={handleAttachmentPress}
            >
              {(transaction.attachment?.uri || transaction.attachment?.url || transaction.attachment) ? (
                <Image
                  source={{ uri: transaction.attachment?.uri || transaction.attachment?.url || transaction.attachment }}
                  style={styles.attachmentImage}
                  resizeMode="cover"
                  onError={(error) => console.error('Image loading error:', error)}
                />
              ) : (
                <View style={[styles.attachmentImage, { backgroundColor: COLORS.GRAY_200, justifyContent: 'center', alignItems: 'center' }]}>
                  <Icon name="image" size={32} color={COLORS.GRAY_400} />
                </View>
              )}
              <View style={styles.attachmentOverlay}>
                <Icon name="zoom-in" size={32} color={COLORS.WHITE} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <CustomButton
            title="Edit Transaction"
            onPress={handleEditTransaction}
            style={styles.editButton}
            icon={
              <Icon
                name="edit"
                size={24}
                color={COLORS.WHITE}
                style={styles.buttonIcon}
              />
            }
          />
          
          <CustomButton
            title="Delete Transaction"
            onPress={handleDeleteTransaction}
            style={styles.deleteButton}
            icon={
              <Icon
                name="delete"
                size={24}
                color={COLORS.WHITE}
                style={styles.buttonIcon}
              />
            }
          />
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      {showImageViewer && selectedAttachment && (
        <ImageViewer
          visible={showImageViewer}
          attachment={selectedAttachment}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={confirmDeleteTransaction}
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
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 0,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.SM,
    zIndex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.LG,
  },
  transactionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,

    marginBottom: SPACING.LG,
    ...SHADOWS.MD,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.LG,
  },
  transactionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    width: '45%',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  notesSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  notesCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.SMALL,
  },
  notesText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },
  attachmentSection: {
    marginBottom: SPACING.LG,
  },
  attachmentCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    ...SHADOWS.SMALL,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
  },
  attachmentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    gap: SPACING.MD,
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
  },
  buttonIcon: {
    marginRight: SPACING.SM,
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

export default TransactionDetailScreen;
