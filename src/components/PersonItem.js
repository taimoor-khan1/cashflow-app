import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';

const PersonItem = ({
  name,
  notes,
  balance,
  totalIncome,
  totalExpenses,
  transactionCount,
  onPress,
}) => {
  const formatAmount = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const getBalanceColor = () => {
    return balance >= 0 ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getBalancePrefix = () => {
    return balance >= 0 ? '+' : '-';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.avatar, { backgroundColor: COLORS.PRIMARY }]}>
          <Text style={styles.avatarText}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {notes && (
            <Text style={styles.notes} numberOfLines={2}>
              {notes}
            </Text>
          )}
          <Text style={styles.transactionCount}>
            {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[
          styles.balance,
          { color: getBalanceColor() }
        ]}>
          {getBalancePrefix()}{formatAmount(balance)}
        </Text>
        
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            +{formatAmount(totalIncome)}
          </Text>
          <Text style={styles.summaryText}>
            -{formatAmount(totalExpenses)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.FULL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  notes: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  transactionCount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_TERTIARY,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XS,
  },
  summary: {
    alignItems: 'flex-end',
  },
  summaryText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 2,
  },
});

export default PersonItem;
