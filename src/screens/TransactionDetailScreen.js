import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA, SHADOWS } from '../constants';
import CustomButton from '../components/CustomButton';
import ImageViewer from '../components/ImageViewer';

const TransactionDetailScreen = ({ navigation, route }) => {
  const { transactionId } = route.params;
  
  const [transaction, setTransaction] = useState(null);
  const [person, setPerson] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = MOCK_DATA.TRANSACTIONS.find(t => t.id === transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        const foundPerson = MOCK_DATA.PERSONS.find(p => p.id === foundTransaction.personId);
        setPerson(foundPerson);
      }
    }
  }, [transactionId]);

  if (!transaction) {
    return (
      <View style={styles.container}>
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

  const handleEditTransaction = () => {
    navigation.navigate('AddTransaction', { 
      transactionId,
      person: person,
      isEditing: true 
    });
  };

  const handleDeleteTransaction = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle deletion
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAttachmentPress = () => {
    if (transaction.attachment) {
      setSelectedAttachment(transaction.attachment);
      setShowImageViewer(true);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? 'trending-up' : 'trending-down';
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? COLORS.SUCCESS : COLORS.ERROR;
  };

  const getTransactionPrefix = (type) => {
    return type === 'income' ? '+' : '-';
  };

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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Alert.alert(
                'Transaction Options',
                'Choose an action',
                [
                  { text: 'Edit', onPress: handleEditTransaction },
                  { text: 'Delete', onPress: handleDeleteTransaction, style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Icon name="more-vert" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Summary Card */}
        <View style={styles.summaryCard}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getTransactionColor(transaction.type) === COLORS.SUCCESS ? COLORS.SUCCESS_LIGHT : COLORS.ERROR_LIGHT }
          ]}>
            <Icon 
              name={getTransactionIcon(transaction.type)} 
              size={32} 
              color={getTransactionColor(transaction.type)} 
            />
          </View>
          
          <Text style={styles.transactionType}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </Text>
          
          <Text style={[
            styles.amount,
            { color: getTransactionColor(transaction.type) }
          ]}>
            {getTransactionPrefix(transaction.type)}
            {formatCurrency(transaction.amount)}
          </Text>
          
          <Text style={styles.category}>{transaction.category}</Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Icon name="person" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.detailLabel}>Person</Text>
            <Text style={styles.detailValue}>{person?.name || 'Unknown'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="event" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
          </View>
          
          {transaction.notes && (
            <View style={styles.detailRow}>
              <Icon name="note" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{transaction.notes}</Text>
            </View>
          )}
        </View>

        {/* Attachment Section */}
        {transaction.attachment && (
          <View style={styles.attachmentCard}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            
            <TouchableOpacity
              style={styles.attachmentPreview}
              onPress={handleAttachmentPress}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: transaction.attachment.uri }} 
                style={styles.attachmentImage} 
              />
              <View style={styles.attachmentOverlay}>
                <Icon name="visibility" size={24} color={COLORS.WHITE} />
                <Text style={styles.attachmentText}>Tap to view</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.attachmentName}>{transaction.attachment.name}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <CustomButton
            title="Edit Transaction"
            onPress={handleEditTransaction}
            variant="outline"
            style={styles.editButton}
          />
          
          <CustomButton
            title="Delete Transaction"
            onPress={handleDeleteTransaction}
            variant="outline"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>

      <ImageViewer
        visible={showImageViewer}
        attachment={selectedAttachment}
        onClose={() => setShowImageViewer(false)}
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
    paddingBottom: 24,
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
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
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
    padding: 20,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  transactionType: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    marginBottom: 8,
  },
  category: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  detailsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    minWidth: 60,
  },
  detailValue: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
  },
  attachmentCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.MD,
  },
  attachmentPreview: {
    position: 'relative',
    marginBottom: 12,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  attachmentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.OVERLAY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  attachmentText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  attachmentName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  actionsSection: {
    gap: 12,
  },
  editButton: {
    borderRadius: 16,
  },
  deleteButton: {
    borderRadius: 16,
    borderColor: COLORS.ERROR,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.ERROR,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 32,
  },
});

export default TransactionDetailScreen;
