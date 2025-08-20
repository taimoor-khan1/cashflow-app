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
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA, SHADOWS } from '../constants';
import CustomButton from '../components/CustomButton';
import TransactionItem from '../components/TransactionItem';
import ImageViewer from '../components/ImageViewer';

const PersonDetailScreen = ({ navigation, route }) => {
  const { personId } = route.params;
  
  // Add safety check for personId
  if (!personId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid person ID</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </View>
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
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Person not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </View>
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
    navigation.navigate('TransactionDetail', { transactionId });
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

  const getBalanceColor = (balance) => (balance >= 0 ? COLORS.SUCCESS : COLORS.ERROR);
  const getBalancePrefix = (balance) => (balance >= 0 ? '+' : '');

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
          <Text style={styles.headerTitle}>{person.name}</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Alert.alert(
                'Person Options',
                'Choose an action',
                [
                  { text: 'Edit', onPress: handleEditPerson },
                  { text: 'Delete', onPress: handleDeletePerson, style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Icon name="more-vert" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {person.notes || 'No notes available'}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Person Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: COLORS.PRIMARY }]}>
              <Text style={styles.avatarText}>
                {person.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={[styles.balanceAmount, { color: getBalanceColor(person.balance) }]}>
              {getBalancePrefix(person.balance)}
              {formatCurrency(Math.abs(person.balance))}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.statValue}>+{formatCurrency(person.totalIncome)}</Text>
              <Text style={styles.statLabel}>Total Income</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="trending-down" size={20} color={COLORS.ERROR} />
              <Text style={styles.statValue}>-{formatCurrency(person.totalExpenses)}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="receipt" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.statValue}>{person.transactionCount}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <CustomButton
            title="Add Transaction"
            onPress={handleAddTransaction}
            style={styles.addTransactionButton}
          />
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Transactions ({transactions.length})
            </Text>
          </View>

          {transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction.id)}
                  onAttachmentPress={handleAttachmentPress}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt" size={48} color={COLORS.GRAY_400} />
              <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Start by adding your first transaction with {person.name}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ImageViewer
        visible={showImageViewer}
        attachment={selectedAttachment}
        onClose={() => setShowImageViewer(false)}
      />
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
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...SHADOWS.MD,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  actionsSection: {
    marginBottom: 24,
  },
  addTransactionButton: {
    borderRadius: 16,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  transactionsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.ERROR,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 32,
  },
});

export default PersonDetailScreen;
