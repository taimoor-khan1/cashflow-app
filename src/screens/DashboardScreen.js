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
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, MOCK_DATA, SHADOWS } from '../constants';
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
    const totalIncome = MOCK_DATA.PERSONS.reduce((sum, p) => sum + p.totalIncome, 0);
    const totalExpenses = MOCK_DATA.PERSONS.reduce((sum, p) => sum + p.totalExpenses, 0);
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

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
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>John Doe</Text>
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
            {getBalancePrefix(dashboardData.totalBalance)}
            {formatCurrency(Math.abs(dashboardData.totalBalance))}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Icon name="trending-up" size={16} color={COLORS.SUCCESS} />
              <Text style={styles.balanceStatText}>
                +{formatCurrency(dashboardData.totalIncome)}
              </Text>
            </View>
            <View style={styles.balanceStat}>
              <Icon name="trending-down" size={16} color={COLORS.ERROR} />
              <Text style={styles.balanceStatText}>
                -{formatCurrency(dashboardData.totalExpenses)}
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
            onPress={() => navigation.navigate('AddPerson')}
          >
            <LinearGradient
              colors={COLORS.GRADIENT_PRIMARY}
              style={styles.actionIcon}
            >
              <Icon name="person-add" size={24} color={COLORS.WHITE} />
            </LinearGradient>
            <Text style={styles.actionText}>Add Person</Text>
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
            {dashboardData.recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
              >
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'income' ? COLORS.SUCCESS_LIGHT : COLORS.ERROR_LIGHT }
                ]}>
                  <Icon
                    name={transaction.type === 'income' ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={transaction.type === 'income' ? COLORS.SUCCESS : COLORS.ERROR}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionPerson}>{transaction.personName}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'income' ? COLORS.SUCCESS : COLORS.ERROR }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top People */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top People</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PersonsList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.peopleList}>
            {dashboardData.topPeople.map((person, index) => (
              <TouchableOpacity
                key={person.id}
                style={styles.personItem}
                onPress={() => navigation.navigate('PersonDetail', { personId: person.id })}
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
            ))}
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.chartContainer}>
            <ChartComponent
              type="line"
              title="Cash Flow Trend"
              data={MOCK_DATA.CHART_DATA.monthlyCashFlow}
              height={200}
            />
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
    paddingTop: 60,
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
  transactionItem: {
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
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  transactionPerson: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
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
  chartContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.MD,
  },
});

export default DashboardScreen;
