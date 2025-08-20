import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA, SHADOWS } from '../constants';
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={COLORS.GRADIENT_PRIMARY}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Person Accounts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPerson}
          >
            <Icon name="person-add" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          Manage your cash flow with friends, clients, and partners
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_DATA.PERSONS.length > 0 ? (
          <View style={styles.personsList}>
            {MOCK_DATA.PERSONS.map((person) => (
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
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
            </View>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    // lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  personsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  quickActionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  quickActionButton: {
    borderRadius: 16,
  },
});

export default PersonsListScreen;
