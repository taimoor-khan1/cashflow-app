import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, MOCK_DATA } from '../constants';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import ImageViewer from '../components/ImageViewer';

const TransactionDetailScreen = ({ navigation, route }) => {
  const { transactionId } = route.params;
  
  const [transaction, setTransaction] = useState(null);
  const [person, setPerson] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = MOCK_DATA.TRANSACTIONS.find(t => t.id === transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        const foundPerson = MOCK_DATA.PERSONS.find(p => p.id === foundTransaction.personId);
        setPerson(foundPerson);
      }
    }
  }, [transactionId]);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleEditTransaction = () => {
    navigation.navigate('AddTransaction', { 
      transactionId,
      person: person,
      isEditing: true 
    });
  };

  const handleDeleteTransaction = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
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

  const handleAttachmentPress = () => {
    if (transaction.attachment) {
      setSelectedAttachment(transaction.attachment);
      setShowImageViewer(true);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeColor = (type) => {
    return type === 'income' ? COLORS.INCOME : COLORS.EXPENSE;
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? 'trending-up' : 'trending-down';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Transaction Details</Text>
          <Text style={styles.subtitle}>
            {transaction.notes}
          </Text>
        </View>

        {/* Transaction Type Card */}
        <Card style={styles.typeCard}>
          <View style={styles.typeHeader}>
            <Icon 
              name={getTypeIcon(transaction.type)} 
              size={24} 
              color={getTypeColor(transaction.type)} 
            />
            <Text style={[styles.typeText, { color: getTypeColor(transaction.type) }]}>
              {transaction.type.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.amount, { color: getTypeColor(transaction.type) }]}>
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
        </Card>

        {/* Transaction Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{transaction.notes}</Text>
          </View>
        </Card>

        {/* Person Details */}
        {person && (
          <Card style={styles.personCard}>
            <Text style={styles.sectionTitle}>Person</Text>
            <TouchableOpacity 
              style={styles.personRow}
              onPress={() => navigation.navigate('PersonDetail', { personId: person.id })}
            >
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personBalance}>
                  Balance: {formatCurrency(person.balance)}
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>
          </Card>
        )}

        {/* Attachment */}
        {transaction.attachment && (
          <Card style={styles.attachmentCard}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            <TouchableOpacity 
              style={styles.attachmentRow}
              onPress={handleAttachmentPress}
            >
              <Image 
                source={{ uri: transaction.attachment.uri }} 
                style={styles.attachmentThumbnail}
                resizeMode="cover"
              />
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName}>{transaction.attachment.name}</Text>
                <Text style={styles.attachmentType}>{transaction.attachment.type}</Text>
              </View>
              <Icon name="open-in-new" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Edit Transaction"
            onPress={handleEditTransaction}
            variant="outline"
            style={styles.editButton}
          />
          
          <CustomButton
            title="Delete Transaction"
            onPress={handleDeleteTransaction}
            variant="outline"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      {showImageViewer && selectedAttachment && (
        <ImageViewer
          visible={showImageViewer}
          image={selectedAttachment}
          onClose={() => setShowImageViewer(false)}
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
    paddingBottom: SPACING.XL * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.FONT_SIZE.LG,
  },
  typeCard: {
    alignItems: 'center',
    padding: SPACING.XL,
    marginBottom: SPACING.LG,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  typeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    marginLeft: SPACING.SM,
  },
  amount: {
    fontSize: TYPOGRAPHY.FONT_SIZE['3XL'],
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  detailsCard: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    flex: 2,
    textAlign: 'right',
  },
  personCard: {
    marginBottom: SPACING.LG,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  personBalance: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  attachmentCard: {
    marginBottom: SPACING.LG,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.MD,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  attachmentType: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  actionButtons: {
    gap: SPACING.MD,
  },
  editButton: {
    marginBottom: SPACING.SM,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
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
    textAlign: 'center',
  },
  errorButton: {
    width: 200,
  },
});

export default TransactionDetailScreen;
