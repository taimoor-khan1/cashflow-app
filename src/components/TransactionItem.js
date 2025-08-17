import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';

const TransactionItem = ({ 
  id,
  type, 
  amount, 
  category, 
  notes, 
  date, 
  personName, 
  attachment,
  onPress, 
  onAttachmentPress,
  style 
}) => {
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
    return type === 'income' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getTransactionPrefix = (type) => {
    return type === 'income' ? '+' : '-';
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTransactionIcon(type)}</Text>
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

        {attachment && (
          <TouchableOpacity 
            style={styles.attachmentContainer} 
            onPress={onAttachmentPress}
            activeOpacity={0.7}
          >
            <Icon name="attach-file" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.attachmentText}>Has attachment</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <View style={styles.typeContainer}>
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
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginVertical: SPACING.SM,
    marginHorizontal: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
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
    marginBottom: SPACING.SM,
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
    backgroundColor: COLORS.GRAY_100,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  type: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    textTransform: 'capitalize',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
    gap: SPACING.XS,
  },
  attachmentText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
});

export default TransactionItem;
