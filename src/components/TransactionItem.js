import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

const TransactionItem = ({ 
  transaction,
  onPress, 
  onAttachmentPress,
  style 
}) => {
  const { type, amount, category, notes, date, personName, attachment } = transaction;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? 'trending-up' : 'trending-down';
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getTransactionPrefix = (type) => {
    return type === 'income' ? '+' : '-';
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: type === 'income' ? '#DCFCE7' : '#FEE2E2' }
      ]}>
        <Icon 
          name={getTransactionIcon(type)} 
          size={20} 
          color={getTransactionColor(type)} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{category}</Text>
          <Text
            style={[
              styles.amount,
              { color: getTransactionColor(type) },
            ]}
          >
            {getTransactionPrefix(type)}
            {formatCurrency(amount)}
          </Text>
        </View>

        {notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {notes}
          </Text>
        )}

        {personName && (
          <Text style={styles.personName}>
            {personName}
          </Text>
        )}

        {attachment && (
          <TouchableOpacity 
            style={styles.attachmentContainer} 
            onPress={() => onAttachmentPress(attachment)}
            activeOpacity={0.7}
          >
            <Icon name="attach-file" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.attachmentText}>Has attachment</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <View style={[
            styles.typeContainer,
            { backgroundColor: type === 'income' ? '#DCFCE7' : '#FEE2E2' }
          ]}>
            <Text
              style={[
                styles.type,
                { color: getTransactionColor(type) },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    ...SHADOWS.MD,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  amount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  notes: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  personName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_TERTIARY,
  },
  typeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  type: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    textTransform: 'capitalize',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  attachmentText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
});

export default TransactionItem;
