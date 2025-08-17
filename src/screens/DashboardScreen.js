import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, MOCK_DATA } from '../constants';
import ChartComponent from '../components/ChartComponent';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    recentTransactions: [],
    topPeople: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const totalIncome = MOCK_DATA.PERSONS.reduce((sum, person) => sum + person.totalIncome, 0);
    const totalExpenses = MOCK_DATA.PERSONS.reduce((sum, person) => sum + person.totalExpenses, 0);
    const totalBalance = totalIncome - totalExpenses;
    const recentTransactions = MOCK_DATA.TRANSACTIONS.slice(0, 5);
    const topPeople = [...MOCK_DATA.PERSONS]
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 3);

    setDashboardData({
      totalBalance,
      totalIncome,
      totalExpenses,
      recentTransactions,
      topPeople,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceColor = (balance) => {
    return balance >= 0 ? COLORS.SUCCESS : COLORS.ERROR;
  };

  const getBalancePrefix = (balance) => {
    return balance >= 0 ? '+' : '';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! 🌅';
    if (hour < 17) return 'Good Afternoon! ☀️';
    return 'Good Evening! 🌙';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle" size={40} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {getBalancePrefix(dashboardData.totalBalance)}
            {formatCurrency(Math.abs(dashboardData.totalBalance))}
          </Text>
          
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIcon}>
                <Icon name="trending-up" size={16} color={COLORS.SUCCESS} />
              </View>
              <View>
                <Text style={styles.balanceItemLabel}>Income</Text>
                <Text style={styles.balanceItemValue}>
                  +{formatCurrency(dashboardData.totalIncome)}
                </Text>
              </View>
            </View>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIcon}>
                <Icon name="trending-down" size={16} color={COLORS.ERROR} />
              </View>
              <View>
                <Text style={styles.balanceItemLabel}>Expenses</Text>
                <Text style={styles.balanceItemValue}>
                  -{formatCurrency(dashboardData.totalExpenses)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#4F46E5' }]}
              onPress={() => navigation.navigate('AddPerson')}
            >
              <Icon name="person-add" size={24} color={COLORS.WHITE} />
              <Text style={styles.actionText}>Add Person</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#7C3AED' }]}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Icon name="add-circle" size={24} color={COLORS.WHITE} />
              <Text style={styles.actionText}>Add Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#059669' }]}
              onPress={() => navigation.navigate('PersonsList')}
            >
              <Icon name="people" size={24} color={COLORS.WHITE} />
              <Text style={styles.actionText}>View People</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#DC2626' }]}
              onPress={() => navigation.navigate('TransactionsList')}
            >
              <Icon name="receipt" size={24} color={COLORS.WHITE} />
              <Text style={styles.actionText}>View Transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="people" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.statValue}>{MOCK_DATA.PERSONS.length}</Text>
              <Text style={styles.statLabel}>Total People</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="receipt" size={20} color={COLORS.SECONDARY} />
              </View>
              <Text style={styles.statValue}>{MOCK_DATA.TRANSACTIONS.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="trending-up" size={20} color={COLORS.ACCENT} />
              </View>
              <Text style={styles.statValue}>+15%</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="account-balance-wallet" size={20} color={COLORS.SUCCESS} />
              </View>
              <Text style={styles.statValue}>$2.4K</Text>
              <Text style={styles.statLabel}>Avg. Balance</Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Monthly Cash Flow</Text>
                <Text style={styles.chartSubtitle}>Income vs Expenses</Text>
              </View>
              <TouchableOpacity style={styles.chartFilter}>
                <Text style={styles.filterText}>2024</Text>
                <Icon name="keyboard-arrow-down" size={20} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            </View>
            <ChartComponent
              data={MOCK_DATA.CHART_DATA.monthlyCashFlow.map(item => ({
                category: item.month,
                value: Math.round(((item.income - item.expenses) / (item.income + item.expenses)) * 100),
              }))}
              type="bar"
            />
          </View>
        </View>

        {/* Top People */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="emoji-events" size={24} color={COLORS.ACCENT} />
              <View>
                <Text style={styles.sectionTitle}>Top People</Text>
                <Text style={styles.sectionSubtitle}>Most active contacts</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('PersonsList')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Icon name="arrow-forward" size={16} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.peopleList}>
            {dashboardData.topPeople.map((person, index) => (
              <TouchableOpacity
                key={person.id}
                style={styles.personItem}
                onPress={() => navigation.navigate('PersonDetail', { personId: person.id })}
              >
                <View style={[styles.personRank, { backgroundColor: getRankColor(index) }]}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personStats}>
                    {person.transactionCount} transactions • {formatCurrency(person.balance)} balance
                  </Text>
                </View>
                <View style={styles.personBalance}>
                  <Text
                    style={[
                      styles.personBalanceText,
                      { color: getBalanceColor(person.balance) },
                    ]}
                  >
                    {getBalancePrefix(person.balance)}
                    {formatCurrency(Math.abs(person.balance))}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="history" size={24} color={COLORS.SECONDARY} />
              <View>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <Text style={styles.sectionSubtitle}>Latest activities</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('TransactionsList')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Icon name="arrow-forward" size={16} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {dashboardData.recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'income' ? COLORS.SUCCESS + '20' : COLORS.ERROR + '20' }
                ]}>
                  <Icon 
                    name={transaction.type === 'income' ? 'trending-up' : 'trending-down'} 
                    size={20} 
                    color={transaction.type === 'income' ? COLORS.SUCCESS : COLORS.ERROR} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionNotes}>{transaction.notes}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text
                    style={[
                      styles.transactionAmountText,
                      { color: getBalanceColor(transaction.type === 'income' ? transaction.amount : -transaction.amount) },
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getRankColor = (index) => {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
  return colors[index] || COLORS.GRAY_100;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 20,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginBottom: 2,
  },
  balanceItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  chartFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#1E293B',
    marginRight: 4,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginRight: 4,
  },
  peopleList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  personRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  personStats: {
    fontSize: 12,
    color: '#64748B',
  },
  personBalance: {
    alignItems: 'flex-end',
  },
  personBalanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  transactionNotes: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
