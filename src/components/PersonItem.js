import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { formatCurrency } from '../utils';

const PersonItem = ({
  name,
  notes,
  balance,
  totalIncome,
  totalExpenses,
  transactionCount,
  onPress,
}) => {
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
      activeOpacity={0.8}
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
          {getBalancePrefix()}{formatCurrency(balance)}
        </Text>
        
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            +{formatCurrency(totalIncome)}
          </Text>
          <Text style={styles.summaryText}>
            -{formatCurrency(totalExpenses)}
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
    padding: 18,
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    marginBottom: 16,
    ...SHADOWS.MD,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    marginBottom: 6,
  },
  notes: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
    // lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
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
    marginBottom: 6,
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
