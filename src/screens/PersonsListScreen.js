import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants';
import PersonItem from '../components/PersonItem';
import CustomButton from '../components/CustomButton';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../navigation/AppNavigator';

const PersonsListScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { 
    personsWithStats: persons, 
    loading, 
    error, 
    refreshData 
  } = useRealTimeData();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('PersonsListScreen: useEffect triggered');
  }, []);



  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  const handleAccountPress = (personId) => {
    console.log('Account pressed with ID:', personId);
    console.log('Account ID type:', typeof personId);
    console.log('Account ID value:', personId);
    
    if (personId) {
      console.log('Navigating to AccountDetail with ID:', personId);
      navigation.navigate('AccountDetail', { personId });
    } else {
      console.error('Invalid account ID received:', personId);
      Alert.alert('Error', 'Invalid account selected. Please try again.');
    }
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
            <Text style={styles.headerTitle}>Accounts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAccount}
            >
              <Icon name="account-balance" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
          <Text style={styles.headerTitle}>Accounts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAccount}
          >
            <Icon name="account-balance" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {persons.length > 0 ? (
          <View style={styles.personsList}>
            {persons.map((person, index) => (
              <PersonItem
                key={person.id}
                id={person.id}
                name={person.name}
                notes={person.notes}
                balance={person.balance || 0}
                totalIncome={person.totalIncome || 0}
                totalExpenses={person.totalExpenses || 0}
                transactionCount={person.transactionCount || 0}
                onPress={() => handleAccountPress(person.id)}
                rank={index}
                showRank={true}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
            </View>
            <Text style={styles.emptyTitle}>No Accounts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding your first account to track cash flow
            </Text>
            <CustomButton
              title="Add First Account"
              onPress={handleAddAccount}
              style={styles.emptyButton}
            />
          </View>
        )}

        {/* Quick Action Button */}
        {persons.length > 0 && (
          <View style={styles.quickActionContainer}>
            <CustomButton
              title="Add Transaction"
              onPress={handleAddTransaction}
              style={styles.quickActionButton}
              icon={
                <Icon
                  name="add"
                  size={24}
                  color={COLORS.WHITE}
                  style={styles.quickActionIcon}
                />
              }
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.LG,
  },
  personsList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.MD,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.LG,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  quickActionContainer: {
    marginTop: SPACING.XL,
    paddingHorizontal: SPACING.MD,
  },
  quickActionButton: {
    backgroundColor: COLORS.SECONDARY,
  },
  quickActionIcon: {
    marginRight: SPACING.SM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default PersonsListScreen;
