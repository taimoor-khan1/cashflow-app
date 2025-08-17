import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

const { width } = Dimensions.get('window');

const ChartComponent = ({ data, title, type = 'bar' }) => {
  const renderBarChart = () => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item.value));
    const chartWidth = width - 40; // Account for padding

    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.value / maxValue) * 120,
                    backgroundColor: COLORS.PRIMARY,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel} numberOfLines={1}>
              {item.category}
            </Text>
            <Text style={styles.barValue}>{item.value}%</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLineChart = () => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item.value));
    const chartWidth = width - 40;
    const pointSpacing = chartWidth / (data.length - 1);

    return (
      <View style={styles.lineChartContainer}>
        <View style={styles.lineChart}>
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = 120 - (item.value / maxValue) * 120;

            return (
              <View
                key={index}
                style={[
                  styles.linePoint,
                  {
                    left: x - 4,
                    top: y - 4,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.lineChartLabels}>
          {data.map((item, index) => (
            <Text key={index} style={styles.lineLabel} numberOfLines={1}>
              {item.category}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

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
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: COLORS.PRIMARY },
                ]}
              />
              <Text style={styles.legendText}>{item.category}</Text>
              <Text style={styles.legendValue}>{item.value}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChart = () => {
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
});

export default ChartComponent;
