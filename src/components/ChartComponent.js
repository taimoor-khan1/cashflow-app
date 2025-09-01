import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

const { width } = Dimensions.get('window');

const ChartComponent = ({ data, title, type = 'bar', dataType = 'default' }) => {
  console.log('ChartComponent: Received data:', data);
  console.log('ChartComponent: Data type:', dataType);
  console.log('ChartComponent: Chart type:', type);
  
  const renderBarChart = () => {
    if (!data || data.length === 0) {
      console.log('ChartComponent: No data available for bar chart');
      return null;
    }

    // Handle different data types
    let chartData = [];
    let maxValue = 0;

    if (dataType === 'monthly') {
      // For monthly breakdown data (income/expenses)
      chartData = data.map(item => ({
        label: item.month,
        income: item.income || 0,
        expenses: item.expenses || 0,
        net: item.net || 0
      }));
      maxValue = Math.max(...chartData.map(item => Math.max(item.income, item.expenses, Math.abs(item.net))));
      console.log('ChartComponent: Monthly chart data processed:', chartData);
      console.log('ChartComponent: Max value for monthly chart:', maxValue);
    } else {
      // For default data (value/category)
      chartData = data.map(item => ({
        label: item.category || item.label || 'Unknown',
        value: item.value || 0
      }));
      maxValue = Math.max(...chartData.map(item => item.value));
      console.log('ChartComponent: Default chart data processed:', chartData);
      console.log('ChartComponent: Max value for default chart:', maxValue);
    }

    if (maxValue <= 0) {
      console.log('ChartComponent: Max value is 0 or negative, showing empty chart structure');
      
      if (dataType === 'monthly') {
        // Show the monthly structure even with 0 values
        return (
          <View style={styles.chartContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.monthlyBarContainer}>
                <View style={styles.monthlyBarWrapper}>
                  {/* Show minimal bars even for 0 values */}
                  <View
                    style={[
                      styles.monthlyBar,
                      {
                        height: 4,
                        backgroundColor: COLORS.GRAY_300,
                        marginBottom: 2,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.monthlyBar,
                      {
                        height: 4,
                        backgroundColor: COLORS.GRAY_300,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.monthlyBarLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.monthlyBarValue}>
                  {item.net >= 0 ? '+' : ''}{item.net.toFixed(0)}
                </Text>
              </View>
            ))}
          </View>
        );
      }
      
      return null;
    }
    
    const chartWidth = width - 40; // Account for padding

    if (dataType === 'monthly') {
      // Render monthly breakdown with income/expenses bars
      return (
        <View style={styles.chartContainer}>
          {chartData.map((item, index) => {
            const incomeHeight = maxValue > 0 ? (item.income / maxValue) * 120 : 0;
            const expensesHeight = maxValue > 0 ? (item.expenses / maxValue) * 120 : 0;
            
            return (
              <View key={index} style={styles.monthlyBarContainer}>
                <View style={styles.monthlyBarWrapper}>
                  {/* Income bar */}
                  <View
                    style={[
                      styles.monthlyBar,
                      {
                        height: Math.max(0, incomeHeight),
                        backgroundColor: COLORS.SUCCESS,
                        marginBottom: 2,
                      },
                    ]}
                  />
                  {/* Expenses bar */}
                  <View
                    style={[
                      styles.monthlyBar,
                      {
                        height: Math.max(0, expensesHeight),
                        backgroundColor: COLORS.ERROR,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.monthlyBarLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.monthlyBarValue}>
                  {item.net >= 0 ? '+' : ''}{item.net.toFixed(0)}
                </Text>
              </View>
            );
          })}
        </View>
      );
    } else {
      // Render default bar chart
      return (
        <View style={styles.chartContainer}>
          {chartData.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 120 : 0;
            if (isNaN(height)) return null;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(0, height),
                        backgroundColor: COLORS.PRIMARY,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.barValue}>{item.value || 0}%</Text>
              </View>
            );
          })}
        </View>
      );
    }
  };

  const renderLineChart = () => {
    if (!data || data.length === 0) return null;

    let chartData = [];
    let maxValue = 0;

    if (dataType === 'monthly') {
      chartData = data.map(item => ({
        label: item.month,
        value: item.net || 0
      }));
    } else {
      chartData = data.map(item => ({
        label: item.category || item.label || 'Unknown',
        value: item.value || 0
      }));
    }

    maxValue = Math.max(...chartData.map(item => Math.abs(item.value)));
    if (maxValue <= 0) return null;
    
    const chartWidth = width - 40;
    const pointSpacing = chartWidth / Math.max(chartData.length - 1, 1);

    return (
      <View style={styles.lineChartContainer}>
        <View style={styles.lineChart}>
          {chartData.map((item, index) => {
            const x = (index / Math.max(chartData.length - 1, 1)) * chartWidth;
            const y = 120 - ((Math.abs(item.value) / maxValue) * 120);

            // Ensure x and y are valid numbers
            if (isNaN(x) || isNaN(y)) return null;

            return (
              <View
                key={index}
                style={[
                  styles.linePoint,
                  {
                    left: Math.max(0, Math.min(x - 4, chartWidth - 8)),
                    top: Math.max(0, Math.min(y - 4, 120 - 8)),
                    backgroundColor: item.value >= 0 ? COLORS.SUCCESS : COLORS.ERROR,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.lineChartLabels}>
          {chartData.map((item, index) => (
            <Text key={index} style={styles.lineLabel} numberOfLines={1}>
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    if (!data || data.length === 0) return null;

    let chartData = [];
    if (dataType === 'monthly') {
      chartData = data.map(item => ({
        category: item.month,
        value: Math.abs(item.net) || 0
      }));
    } else {
      chartData = data.map(item => ({
        category: item.category || item.label || 'Unknown',
        value: item.value || 0
      }));
    }

    const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total <= 0) return null;
    
    let currentAngle = 0;

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {chartData.map((item, index) => {
            const percentage = ((item.value || 0) / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            if (isNaN(angle) || isNaN(startAngle)) return null;

            return (
              <View
                key={index}
                style={[
                  styles.pieSlice,
                  {
                    transform: [
                      { rotate: `${startAngle}deg` },
                      { scale: 1 },
                    ],
                    backgroundColor: COLORS.PRIMARY,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.pieChartLegend}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: COLORS.PRIMARY },
                ]}
              />
              <Text style={styles.legendText}>{item.category}</Text>
              <Text style={styles.legendValue}>{item.value || 0}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>No data available</Text>
        </View>
      );
    }

    switch (type) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginVertical: SPACING.SM,
    marginHorizontal: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: SPACING.MD,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: SPACING.SM,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XS,
  },
  barValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  // Monthly breakdown specific styles
  monthlyBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  monthlyBarWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: SPACING.SM,
  },
  monthlyBar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  monthlyBarLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XS,
  },
  monthlyBarValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  lineChartContainer: {
    height: 160,
    paddingTop: SPACING.MD,
  },
  lineChart: {
    height: 120,
    position: 'relative',
    marginBottom: SPACING.MD,
  },
  linePoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
  },
  lineChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    flex: 1,
  },
  pieChartContainer: {
    alignItems: 'center',
    paddingTop: SPACING.MD,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.MD,
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  pieChartLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.SM,
  },
  legendText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  legendValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.MD,
  },
  emptyChartText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default ChartComponent;
