import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, MOCK_DATA } from '../constants';
import ChartComponent from '../components/ChartComponent';
import Card from '../components/Card';

const ReportsScreen = ({ navigation }) => {
  // Create sample data for reports since the chart data structure changed
  const sampleMonthlyData = [
    { month: 'Jan', income: 2500, expenses: 1200 },
    { month: 'Feb', income: 3000, expenses: 1800 },
    { month: 'Mar', income: 2800, expenses: 1600 },
    { month: 'Apr', income: 3200, expenses: 2000 },
    { month: 'May', income: 2900, expenses: 1700 },
    { month: 'Jun', income: 3500, expenses: 2200 },
  ];

  const totalIncome = sampleMonthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = sampleMonthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const netCashFlow = totalIncome - totalExpenses;

  const averageMonthlyIncome = totalIncome / sampleMonthlyData.length;
  const averageMonthlyExpenses = totalExpenses / sampleMonthlyData.length;

  // Debug logging
  console.log('ReportsScreen Data:', {
    totalIncome,
    totalExpenses,
    netCashFlow,
    averageMonthlyIncome,
    averageMonthlyExpenses,
    sampleMonthlyData
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBestPerformingMonth = () => {
    return sampleMonthlyData.reduce((best, current) => 
      current.income - current.expenses > best.income - best.expenses ? current : best
    ).month;
  };

  const getTopCategory = () => {
    return MOCK_DATA.CHART_DATA.categoryBreakdown.reduce((top, current) => 
      current.value > top.value ? current : top
    ).category;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={COLORS.GRADIENT_PRIMARY}
            style={styles.headerGradient}
          >
            <Text style={styles.title}>Reports & Analytics</Text>
            <Text style={styles.subtitle}>Track your financial performance</Text>
          </LinearGradient>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.INCOME }]}>
                +{formatCurrency(totalIncome)}
              </Text>
              <Text style={styles.summarySubtext}>
                Avg: {formatCurrency(averageMonthlyIncome)}/month
              </Text>
            </Card>
            
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.EXPENSE }]}>
                -{formatCurrency(totalExpenses)}
              </Text>
              <Text style={styles.summarySubtext}>
                Avg: {formatCurrency(averageMonthlyExpenses)}/month
              </Text>
            </Card>
          </View>
          
          <Card style={[styles.netCashFlowCard, { 
            backgroundColor: netCashFlow >= 0 ? COLORS.INCOME : COLORS.EXPENSE 
          }]}>
            <Text style={styles.netCashFlowLabel}>Net Cash Flow</Text>
            <Text style={styles.netCashFlowAmount}>
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
            </Text>
          </Card>
        </View>

        {/* Monthly Cash Flow Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Monthly Cash Flow</Text>
          <Text style={styles.sectionSubtitle}>
            Track your income vs expenses over time
          </Text>
          <ChartComponent
            type="line"
            title=""
            data={sampleMonthlyData.map(item => ({
              category: item.month,
              value: item.income - item.expenses,
            }))}
          />
        </View>

        {/* Category Breakdown */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <Text style={styles.sectionSubtitle}>
            See how your money is distributed across categories
          </Text>
          <ChartComponent
            type="pie"
            title=""
            data={MOCK_DATA.CHART_DATA.categoryBreakdown || []}
          />
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          
          <Card style={styles.insightCard}>
            <Text style={styles.insightTitle}>💰 Best Performing Month</Text>
            <Text style={styles.insightText}>
              {getBestPerformingMonth()} had the highest net cash flow
            </Text>
          </Card>

          <Card style={styles.insightCard}>
            <Text style={styles.insightTitle}>📊 Top Category</Text>
            <Text style={styles.insightText}>
              {getTopCategory()} accounts for the largest portion of your transactions
            </Text>
          </Card>

          <Card style={styles.insightCard}>
            <Text style={styles.insightTitle}>📈 Growth Trend</Text>
            <Text style={styles.insightText}>
              Your income has been {totalIncome > totalExpenses ? 'growing' : 'declining'} 
              over the past 6 months
            </Text>
          </Card>
        </View>

        {/* Export Options */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          <Text style={styles.sectionSubtitle}>
            Download your financial data for external analysis
          </Text>
          
          <View style={styles.exportButtons}>
            <Card style={styles.exportCard}>
              <Text style={styles.exportIcon}>📊</Text>
              <Text style={styles.exportTitle}>PDF Report</Text>
              <Text style={styles.exportSubtitle}>Monthly summary</Text>
            </Card>
            
            <Card style={styles.exportCard}>
              <Text style={styles.exportIcon}>📈</Text>
              <Text style={styles.exportTitle}>Excel Data</Text>
              <Text style={styles.exportSubtitle}>Raw transaction data</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  header: {
    marginBottom: SPACING.XL,
  },
  headerGradient: {
    padding: SPACING.MD,
    borderRadius: SPACING.MD,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.WHITE,
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
  insightCard: {
    marginBottom: SPACING.MD,
    padding: SPACING.LG,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  insightText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.SM,
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
});

export default ReportsScreen;

