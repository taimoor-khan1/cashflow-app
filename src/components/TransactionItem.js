import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { formatCurrency, resolveCategoryName } from '../utils';

const TransactionItem = ({ 
  transaction,
  onPress, 
  onAttachmentPress,
  style,
  // Individual properties for backward compatibility
  id,
  type,
  amount,
  category,
  notes,
  date,
  personName,
  attachment,
  title,
  // Categories array for resolving category names
  categories = []
}) => {
  // Extract properties from transaction object if provided, otherwise use individual props
  const transactionData = transaction || {};
  const finalType = transactionData.type || type;
  const finalAmount = transactionData.amount || amount;
  const finalCategory = resolveCategoryName(
    transactionData.category || category,
    categories
  );
  const finalNotes = transactionData.notes || notes;
  const finalDate = transactionData.date || date;
  const finalPersonName = transactionData.personName || personName;
  const finalAttachment = transactionData.attachment || attachment;
  const finalTitle = transactionData.title || title || finalCategory || 'Transaction';
  console.log({transactionData})

  // Safety check - if no type is provided, don't render
  if (!finalType) {
    console.warn('TransactionItem: No type provided, skipping render');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
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

  const handleAttachmentPress = () => {
    if (onAttachmentPress && finalAttachment) {
      // Validate attachment before calling handler
      if (finalAttachment.uri || finalAttachment.url) {
        onAttachmentPress(finalAttachment);
      } else {
        console.warn('Invalid attachment data:', finalAttachment);
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress || (() => console.log('TransactionItem: No onPress handler provided'))} 
      activeOpacity={0.8}
    >
      <View style={[
        styles.transactionIcon,
        { backgroundColor: finalType === 'income' ? '#DCFCE7' : '#FEE2E2' }
      ]}>
        <Icon 
          name={getTransactionIcon(finalType)} 
          size={20} 
          color={getTransactionColor(finalType)} 
        />
      </View>

      <View style={styles.transactionInfo}>
        {/* Title - Most prominent */}
        <Text style={styles.transactionTitle} numberOfLines={1}>
          {finalTitle}
        </Text>
        
        {/* Account name and category on same line */}
        <View style={styles.personCategoryRow}>
          <Text style={styles.transactionPerson}>{finalPersonName || 'Unknown'}</Text>
          <Text style={styles.transactionCategory}> • {finalCategory || 'Other'}</Text>
        </View>
        
        {/* Show notes if they exist */}
        {finalNotes && finalNotes.trim() && (
          <Text style={styles.transactionNotes} numberOfLines={1}>
            {finalNotes}
          </Text>
        )}
        
        {/* Show attachment indicator if it exists */}
        {finalAttachment && (
          <TouchableOpacity 
            style={styles.attachmentIndicator}
            onPress={handleAttachmentPress}
            activeOpacity={0.7}
          >
            <Icon name="attach-file" size={14} color={COLORS.PRIMARY} />
            <Text style={styles.attachmentText}>Has attachment</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.transactionAmount}>
        <Text style={[
          styles.transactionAmountText,
          { color: getTransactionColor(finalType) }
        ]}>
          {getTransactionPrefix(finalType)}
          {formatCurrency(finalAmount || 0)}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(finalDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  personCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  transactionPerson: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
  },
  transactionNotes: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  attachmentText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    marginLeft: 4,
  },
});

export default TransactionItem;
