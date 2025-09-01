import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { formatCurrency } from '../utils';
import CustomButton from '../components/CustomButton';
import TransactionItem from '../components/TransactionItem';
import PersonItem from '../components/PersonItem';
import ChartComponent from '../components/ChartComponent';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../navigation/AppNavigator';
import { useRealTimeData } from '../hooks/useRealTimeData';
import dataService from '../services/dataService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const { 
    dashboardStats, 
    personsWithStats, 
    transactions, 
    loading, 
    error, 
    refreshData 
  } = useRealTimeData();

  useEffect(() => {
    console.log('DashboardScreen: useEffect triggered');
    loadCategories();
  }, []);

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
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getBalanceColor = (balance) => (balance >= 0 ? COLORS.SUCCESS : COLORS.ERROR);
  const getBalancePrefix = (balance) => (balance >= 0 ? '+' : '');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🌅';
    if (hour < 17) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  const getRankColor = (index) => ['#FFD700', '#C0C0C0', '#CD7F32'][index] || '#CBD5E1';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient Header */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {currentUser?.displayName || 'User'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account-circle" size={44} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={COLORS.GRADIENT_SECONDARY}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {getBalancePrefix(dashboardStats.totalBalance)}
            {formatCurrency(Math.abs(dashboardStats.totalBalance))}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Icon name="trending-up" size={16} color={COLORS.SUCCESS} />
              <Text style={styles.balanceStatText}>
                +{formatCurrency(dashboardStats.totalIncome)}
              </Text>
            </View>
            <View style={styles.balanceStat}>
              <Icon name="trending-down" size={16} color={COLORS.ERROR} />
              <Text style={styles.balanceStatText}>
                -{formatCurrency(dashboardStats.totalExpenses)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <LinearGradient
              colors={COLORS.GRADIENT_SUCCESS}
              style={styles.actionIcon}
            >
              <Icon name="add" size={24} color={COLORS.WHITE} />
            </LinearGradient>
            <Text style={styles.actionText}>Add Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <LinearGradient
              colors={COLORS.GRADIENT_PRIMARY}
              style={styles.actionIcon}
            >
              <Icon name="account-balance" size={24} color={COLORS.WHITE} />
            </LinearGradient>
            <Text style={styles.actionText}>Add Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <LinearGradient
              colors={COLORS.GRADIENT_WARNING}
              style={styles.actionIcon}
            >
              <Icon name="analytics" size={24} color={COLORS.WHITE} />
            </LinearGradient>
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionsList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {(() => {
              const recentTransactions = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
              
              return recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    categories={categories}
                    onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="receipt" size={48} color={COLORS.GRAY_400} />
                  <Text style={styles.emptyStateText}>No transactions yet</Text>
                  <Text style={styles.emptyStateSubtext}>Add your first transaction to get started</Text>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Top Accounts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Accounts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AccountsList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.peopleList}>
            {(() => {
              const topPeople = [...personsWithStats]
                .sort((a, b) => b.transactionCount - a.transactionCount)
                .slice(0, 3);
              
              return topPeople.length > 0 ? (
                topPeople.map((person, index) => (
                <TouchableOpacity
                  key={person.id}
                  style={styles.personItem}
                  onPress={() => navigation.navigate('AccountDetail', { personId: person.id })}
                >
                  <View style={styles.personRank}>
                    <Text style={[styles.rankNumber, { color: getRankColor(index) }]}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personStats}>
                      {person.transactionCount} transactions • {formatCurrency(person.balance)} balance
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color={COLORS.GRAY_400} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="account-balance" size={48} color={COLORS.GRAY_400} />
                <Text style={styles.emptyStateText}>No accounts yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first account to get started</Text>
              </View>
            );
            })()}
          </View>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  profileButton: {
    padding: 4,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 20,
    ...SHADOWS.LG,
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 16,
  },
  balanceStats: {
    flexDirection: 'row',
    gap: 24,
  },
  balanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceStatText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    ...SHADOWS.MD,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  transactionsList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.MD,
  },
  peopleList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.MD,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  personRank: {
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
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.MD,
  },
});

export default DashboardScreen;
