import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA } from '../constants';
import PersonItem from '../components/PersonItem';
import CustomButton from '../components/CustomButton';

const PersonsListScreen = ({ navigation }) => {
  const handleAddPerson = () => {
    navigation.navigate('AddPerson');
  };

  const handlePersonPress = (personId) => {
    if (personId) {
      navigation.navigate('PersonDetail', { personId });
    }
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Person Accounts</Text>
        <Text style={styles.subtitle}>
          Manage your cash flow with friends, clients, and partners
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_DATA.PERSONS.length > 0 ? (
          MOCK_DATA.PERSONS.map((person) => (
            <PersonItem
              key={person.id}
              id={person.id}
              name={person.name}
              notes={person.notes}
              balance={person.balance}
              totalIncome={person.totalIncome}
              totalExpenses={person.totalExpenses}
              transactionCount={person.transactionCount}
              onPress={() => handlePersonPress(person.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Person Accounts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding your first person account to track cash flow
            </Text>
            <CustomButton
              title="Add First Person"
              onPress={handleAddPerson}
              style={styles.emptyButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddPerson}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Button */}
      {MOCK_DATA.PERSONS.length > 0 && (
        <View style={styles.quickActionContainer}>
          <CustomButton
            title="Add Transaction"
            onPress={handleAddTransaction}
            variant="secondary"
            style={styles.quickActionButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.SM,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    paddingBottom: SPACING.XL * 2, // Extra padding for FAB
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL * 2,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.LG,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.LG,
    marginBottom: SPACING.XL,
    maxWidth: 300,
  },
  emptyButton: {
    width: 200,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.XL,
    right: SPACING.LG,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  quickActionContainer: {
    position: 'absolute',
    bottom: SPACING.XL,
    left: SPACING.LG,
    right: SPACING.LG,
    zIndex: 999,
  },
  quickActionButton: {
    width: '100%',
  },
});

export default PersonsListScreen;
