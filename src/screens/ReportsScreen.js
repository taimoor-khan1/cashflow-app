import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '../constants';
import { formatCurrency } from '../utils';
import ChartComponent from '../components/ChartComponent';
import Card from '../components/Card';
import dataService from '../services/dataService';
import { useAuth } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from '../contexts/ToastContext';

const ReportsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reportsData, setReportsData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    monthlyData: [],
    categoryData: [],
    totalTransactions: 0,
  });

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      console.log('ReportsScreen: Loading reports data...');

      const stats = await dataService.getDashboardStats();
      console.log('ReportsScreen: Dashboard stats loaded:', stats);

      if (stats) {
        // Get transactions data for calculations
        const transactions = await dataService.getTransactions();
        console.log(
          'ReportsScreen: Transactions loaded:',
          transactions?.length,
        );
        console.log('ReportsScreen: Sample transaction:', transactions?.[0]);

        // Only calculate breakdowns if we have transactions
        let monthlyBreakdown = [];
        let categoryBreakdown = [];

        if (
          transactions &&
          Array.isArray(transactions) &&
          transactions.length > 0
        ) {
          console.log('ReportsScreen: Calculating breakdowns...');
          monthlyBreakdown =
            dataService.calculateMonthlyBreakdown(transactions);
          categoryBreakdown =
            dataService.calculateCategoryBreakdown(transactions);
          console.log(
            'ReportsScreen: Monthly breakdown calculated:',
            monthlyBreakdown,
          );
          console.log(
            'ReportsScreen: Category breakdown calculated:',
            categoryBreakdown,
          );
        } else {
          console.log(
            'ReportsScreen: No transactions available for breakdowns',
          );
        }

        const totalIncome = stats.totalIncome || 0;
        const totalExpenses = stats.totalExpenses || 0;
        const netCashFlow = totalIncome - totalExpenses;
        const averageMonthlyIncome = totalIncome / 6; // Assuming 6 months
        const averageMonthlyExpenses = totalExpenses / 6;

        // Get best performing month
        const bestPerformingMonth =
          monthlyBreakdown.length > 0
            ? monthlyBreakdown.reduce((best, current) =>
                current.income - current.expenses > best.income - best.expenses
                  ? current
                  : best,
              ).month
            : '';

        // Get top category
        const topCategory =
          categoryBreakdown.length > 0
            ? categoryBreakdown.reduce((top, current) =>
                current.total > top.total ? current : top,
              ).category
            : '';

        const finalData = {
          monthlyData: monthlyBreakdown,
          totalIncome,
          totalExpenses,
          netCashFlow,
          averageMonthlyIncome,
          averageMonthlyExpenses,
          bestPerformingMonth,
          topCategory,
          totalTransactions: transactions?.length || 0,
        };

        console.log('ReportsScreen: Setting final reports data:', finalData);
        setReportsData(finalData);
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
      // Set default data on error
      setReportsData({
        monthlyData: [],
        totalIncome: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        averageMonthlyIncome: 0,
        averageMonthlyExpenses: 0,
        bestPerformingMonth: '',
        topCategory: '',
        totalTransactions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadReportsData();
    } catch (error) {
      console.error('Error refreshing reports:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.BACKGROUND}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={COLORS.GRADIENT_PRIMARY} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Reports & Analytics</Text>
            <Text style={styles.headerSubtitle}>
              Track your financial performance
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Icon name="refresh" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header - Matching AccountsListScreen style */}

        {/* Debug Section - Remove after fixing */}
        <Card style={styles.debugCard}>
          <Text style={styles.debugTitle}>Debug Information</Text>
          <Text style={styles.debugText}>
            Total Transactions: {reportsData.totalTransactions || 0}
          </Text>
          <Text style={styles.debugText}>
            Total Income: {reportsData.totalIncome || 0}
          </Text>
          <Text style={styles.debugText}>
            Total Expenses: {reportsData.totalExpenses || 0}
          </Text>
          <Text style={styles.debugText}>
            Net Cash Flow: {reportsData.netCashFlow || 0}
          </Text>
          <Text style={styles.debugText}>
            Monthly Data Count: {reportsData.monthlyData?.length || 0}
          </Text>
          <Text style={styles.debugText}>
            Best Month: {reportsData.bestPerformingMonth || 'N/A'}
          </Text>
          <Text style={styles.debugText}>
            Top Category: {reportsData.topCategory || 'N/A'}
          </Text>
        </Card>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryAmount, {color: COLORS.INCOME}]}>
                +{formatCurrency(reportsData.totalIncome)}
              </Text>
              <Text style={styles.summarySubtext}>
                Avg: {formatCurrency(reportsData.averageMonthlyIncome)}/month
              </Text>
            </Card>

            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, {color: COLORS.EXPENSE}]}>
                -{formatCurrency(reportsData.totalExpenses)}
              </Text>
              <Text style={styles.summarySubtext}>
                Avg: {formatCurrency(reportsData.averageMonthlyExpenses)}/month
              </Text>
            </Card>
          </View>

          <Card
            style={[
              styles.netCashFlowCard,
              {
                backgroundColor:
                  reportsData.netCashFlow >= 0
                    ? COLORS.SUCCESS_LIGHT
                    : COLORS.ERROR_LIGHT,
              },
            ]}>
            <Text style={styles.netCashFlowLabel}>Net Cash Flow</Text>
            <Text
              style={[
                styles.netCashFlowAmount,
                {
                  color:
                    reportsData.netCashFlow >= 0
                      ? COLORS.SUCCESS
                      : COLORS.ERROR,
                },
              ]}>
              {reportsData.netCashFlow >= 0 ? '+' : ''}
              {formatCurrency(reportsData.netCashFlow)}
            </Text>
            <Text style={styles.netCashFlowSubtext}>
              {reportsData.netCashFlow >= 0 ? 'Positive' : 'Negative'} cash flow
            </Text>
          </Card>
        </View>

        {/* Monthly Breakdown Chart */}
        {reportsData.monthlyData.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Breakdown</Text>
            <Text style={styles.chartSubtitle}>
              Total Transactions: {reportsData.totalTransactions || 0}
            </Text>

            <ChartComponent
              data={reportsData.monthlyData}
              type="bar"
              dataType="monthly"
              height={200}
            />
          </Card>
        )}

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>

          <View style={styles.insightsGrid}>
            <Card style={styles.insightCard}>
              <Icon name="trending-up" size={24} color={COLORS.SUCCESS} />
              <Text style={styles.insightLabel}>Best Month</Text>
              <Text style={styles.insightValue}>
                {reportsData.bestPerformingMonth || 'N/A'}
              </Text>
            </Card>

            <Card style={styles.insightCard}>
              <Icon name="category" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.insightLabel}>Top Category</Text>
              <Text style={styles.insightValue}>
                {reportsData.topCategory || 'N/A'}
              </Text>
            </Card>
          </View>
        </View>

        {/* Empty State */}
        {reportsData.monthlyData.length === 0 && (
          <Card style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>
              No Financial Data Available
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Start adding transactions to see your monthly breakdown, income vs
              expenses, and financial analytics.
            </Text>
          </Card>
        )}

        {/* Monthly Data Available but No Transactions */}
        {reportsData.monthlyData.length > 0 &&
          reportsData.totalTransactions === 0 && (
            <Card style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>
                Monthly Structure Ready
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Your monthly breakdown chart is set up and ready. Add some
                transactions to see your financial data populate the chart.
              </Text>

              {/* Test Button - Remove after fixing */}
              <TouchableOpacity
                style={styles.testButton}
                onPress={async () => {
                  try {
                    console.log('Creating test transaction...');
                    const dataService =
                      require('../services/dataService').default;

                    // Create a test person first
                    const testPerson = await dataService.createPerson({
                      name: 'Test Person',
                      notes: 'Test person for debugging',
                    });
                    console.log('Test person created:', testPerson);

                    // Create a test transaction
                    const testTransaction = await dataService.createTransaction(
                      {
                        type: 'income',
                        personId: testPerson.id,
                        amount: 100,
                        category: 'Test',
                        notes: 'Test transaction for debugging',
                        date: new Date().toISOString().split('T')[0],
                      },
                    );
                    console.log('Test transaction created:', testTransaction);

                    // Refresh the data
                    await loadReportsData();

                    showSuccess('Test data created! Check the monthly breakdown now.');

                  } catch (error) {
                    console.error('Error creating test data:', error);
                    showError('Failed to create test data: ' + error.message);
                  }
                }}>
                <Text style={styles.testButtonText}>Create Test Data</Text>
              </TouchableOpacity>
            </Card>
          )}
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
    paddingBottom: 20,
    paddingHorizontal: SPACING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  summarySection: {
    marginBottom: SPACING.XL,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.MD,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  summaryAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XS,
  },
  summarySubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_TERTIARY,
  },
  netCashFlowCard: {
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: COLORS.INCOME,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.MD,
  },
  netCashFlowLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.BLACK,
    marginBottom: SPACING.SM,
  },
  netCashFlowAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.BLACK,
  },
  netCashFlowSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_TERTIARY,
    marginTop: SPACING.XS,
  },
  chartCard: {
    marginBottom: SPACING.XL,
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.MD,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  chartSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  chartSection: {
    marginBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.SM,
  },
  insightsSection: {
    marginBottom: SPACING.XL,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightCard: {
    flex: 1,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    padding: SPACING.MD,
  },
  insightLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
  },
  insightValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.XS,
  },
  exportSection: {
    marginBottom: SPACING.XL,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportCard: {
    flex: 1,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    padding: SPACING.LG,
  },
  exportIcon: {
    fontSize: 32,
    marginBottom: SPACING.SM,
  },
  exportTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  exportSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: SPACING.XL,
    marginTop: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    ...SHADOWS.MD,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.SM,
  },
  debugCard: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.MD,
    padding: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.SM,
  },
  debugTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  debugText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  testButton: {
    marginTop: SPACING.MD,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.LG,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.SM,
  },
  testButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
});

export default ReportsScreen;
