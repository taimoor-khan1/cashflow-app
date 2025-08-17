import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA } from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import TransactionItem from '../components/TransactionItem';
import ImageViewer from '../components/ImageViewer';

const PersonDetailScreen = ({ navigation, route }) => {
  const { personId } = route.params;
  
  // Add safety check for personId
  if (!personId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid person ID</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const [person] = useState(MOCK_DATA.PERSONS.find(p => p.id === personId));
  const [transactions] = useState(
    MOCK_DATA.TRANSACTIONS.filter(t => t.personId === personId)
  );
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  if (!person) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Person not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction', { personId });
  };

  const handleEditPerson = () => {
    navigation.navigate('EditPerson', { personId: person.id });
  };

  const handleDeletePerson = () => {
    Alert.alert(
      'Delete Person',
      `Are you sure you want to delete ${person.name}? This will also delete all associated transactions.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle deletion
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTransactionPress = (transactionId) => {
    // Navigate to transaction detail or edit
    console.log('Transaction pressed:', transactionId);
  };

  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
    setShowImageViewer(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceColor = (balance) => {
    return balance >= 0 ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getBalancePrefix = (balance) => {
    return balance >= 0 ? '+' : '';
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
          <Text style={styles.title}>{person.name}</Text>
          <Text style={styles.subtitle}>
            {person.notes || 'No notes available'}
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.INCOME }]}>
                +{formatCurrency(person.totalIncome)}
              </Text>
            </Card>
            
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.EXPENSE }]}>
                -{formatCurrency(person.totalExpenses)}
              </Text>
            </Card>
          </View>
          
          <Card style={[styles.balanceCard, { 
            backgroundColor: getBalanceColor(person.balance)
          }]}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>
              {getBalancePrefix(person.balance)}{formatCurrency(person.balance)}
            </Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <CustomButton
            title="Add Transaction"
            onPress={handleAddTransaction}
            style={styles.addButton}
          />
          
          <View style={styles.actionButtons}>
            <CustomButton
              title="Edit Person"
              onPress={handleEditPerson}
              variant="outline"
              style={styles.editButton}
            />
            
            <CustomButton
              title="Delete Person"
              onPress={handleDeletePerson}
              variant="outline"
              style={styles.deleteButton}
            />
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Transactions ({transactions.length})
            </Text>
          </View>
          
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                id={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                category={transaction.category}
                notes={transaction.notes}
                date={transaction.date}
                personName={person.name}
                attachment={transaction.attachment}
                onPress={() => handleTransactionPress(transaction.id)}
                onAttachmentPress={() => transaction.attachment && handleAttachmentPress(transaction.attachment)}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Start by adding your first transaction with {person.name}
              </Text>
            </Card>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Transaction Stats</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Total Transactions</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>
                {transactions.filter(t => t.type === 'income').length}
              </Text>
              <Text style={styles.statLabel}>Income Transactions</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>
                {transactions.filter(t => t.type === 'expense').length}
              </Text>
              <Text style={styles.statLabel}>Expense Transactions</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
      
      {/* Image Viewer Modal */}
      {showImageViewer && selectedAttachment && (
        <ImageViewer
          imageUri={selectedAttachment.uri}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedAttachment(null);
          }}
        />
      )}
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
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
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
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  summaryAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  balanceCard: {
    alignItems: 'center',
    padding: SPACING.LG,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.BLACK,
    marginBottom: SPACING.SM,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.BLACK,
  },
  actionsSection: {
    marginBottom: SPACING.XL,
  },
  addButton: {
    marginBottom: SPACING.MD,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  transactionsSection: {
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.XL,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: SPACING.XL,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.SM,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.LG,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },
  errorButton: {
    minWidth: 120,
  },
});

export default PersonDetailScreen;
