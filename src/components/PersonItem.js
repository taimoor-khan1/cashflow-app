import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  rank,
  showRank = false,
}) => {
  const getBalanceColor = () => {
    return balance >= 0 ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getBalancePrefix = () => {
    return balance >= 0 ? '+' : '-';
  };

  const getRankColor = (rankIndex) => {
    switch (rankIndex) {
    
      default: return COLORS.BLACK;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showRank && rank !== undefined && (
        <View style={styles.rankContainer}>
          <Text style={[styles.rankNumber, { color: getRankColor(rank) }]}>
            #{rank + 1}
          </Text>
        </View>
      )}
      
      <View style={styles.personInfo}>
        <Text style={styles.personName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.personStats}>
          {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} • {getBalancePrefix()}{formatCurrency(Math.abs(balance))} balance
        </Text>
        {notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {notes}
          </Text>
        )}
      </View>
      
      <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
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
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  personStats: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
  },
});

export default PersonItem;
