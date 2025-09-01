import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import CustomInput from '../components/CustomInput';
import CustomDropdown from '../components/CustomDropdown';
import CustomButton from '../components/CustomButton';
import ImageViewer from '../components/ImageViewer';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Modal';
import { formatDateForInput } from '../utils';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import dataService from '../services/dataService';
import { useToast } from '../contexts/ToastContext';

const AddTransactionScreen = ({ navigation, route }) => {
  const person = route.params?.person;
  const transactionId = route.params?.transactionId;
  const isEditing = route.params?.isEditing || false;
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    type: 'expense',
    personId: person?.id || '',
    title: '',
    amount: '',
    category: '',
    notes: '',
    date: formatDateForInput(new Date()),
    attachment: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadPersons();
    loadCategories();
    if (isEditing && transactionId) {
      loadTransactionForEditing();
    }
  }, [isEditing, transactionId]);

  const loadPersons = async () => {
    try {
      const personsList = await dataService.getPersons();
      setPersons(personsList);
    } catch (error) {
      console.error('Error loading accounts:', error);
      showError('Failed to load accounts. Please try again.');
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await dataService.getCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('Failed to load categories. Please try again.');
    }
  };

  const loadTransactionForEditing = async () => {
    try {
      console.log('Loading transaction for editing:', transactionId);
      const transactions = await dataService.getTransactions();
      const transactionToEdit = transactions.find(t => t.id === transactionId);
      
      if (transactionToEdit) {
        console.log('Transaction found for editing:', transactionToEdit);
        setFormData({
          type: transactionToEdit.type || 'expense',
          personId: transactionToEdit.personId || '',
          title: transactionToEdit.title || '',
          amount: String(transactionToEdit.amount || ''),
          category: transactionToEdit.category || '',
          notes: transactionToEdit.notes || '',
          date: transactionToEdit.date || formatDateForInput(new Date()),
          attachment: transactionToEdit.attachment || null,
        });
      } else {
        console.error('Transaction not found for editing:', transactionId);
        showError('Transaction not found for editing');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading transaction for editing:', error);
      showError('Failed to load transaction for editing');
      navigation.goBack();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.personId) {
      newErrors.personId = 'Please select an account';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get account name for the transaction
      const selectedAccount = persons.find(p => p.id === formData.personId);
      
      const transactionData = {
        type: formData.type,
        personId: formData.personId,
        personName: selectedAccount?.name || 'Unknown',
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes.trim() || '',
        date: formData.date,
        attachment: formData.attachment,
      };

      if (isEditing && transactionId) {
        // Update existing transaction
        console.log('Updating transaction:', transactionId, transactionData);
        await dataService.updateTransaction(transactionId, transactionData);
        
        showSuccess('Transaction updated successfully!');
        navigation.goBack();
      } else {
        // Create new transaction
        console.log('Creating new transaction:', transactionData);
        await dataService.createTransaction(transactionData);
        
        showSuccess('Transaction added successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      showError(`Failed to ${isEditing ? 'update' : 'add'} transaction. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async (type) => {
    try {
      let result;
      
      if (type === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
        });
      } else {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        handleInputChange('attachment', {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'attachment.jpg',
        });
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const removeAttachment = () => {
    handleInputChange('attachment', null);
  };

  const openImageViewer = () => {
    if (formData.attachment) {
      setShowImageViewer(true);
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.headerSubtitle}>
          {isEditing ? 'Update your financial transaction' : 'Record a new financial transaction'}
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Transaction Type */}
            <View style={styles.typeSelector}>
              <Text style={styles.sectionLabel}>Transaction Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'expense' && styles.typeButtonActive
                  ]}
                  onPress={() => handleInputChange('type', 'expense')}
                >
                  <Icon 
                    name="trending-down" 
                    size={20} 
                    color={formData.type === 'expense' ? COLORS.WHITE : COLORS.ERROR} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === 'expense' && styles.typeButtonTextActive
                  ]}>
                    Expense
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'income' && {backgroundColor:COLORS.SUCCESS}
                  ]}
                  onPress={() => handleInputChange('type', 'income')}
                >
                  <Icon 
                    name="trending-up" 
                    size={20} 
                    color={formData.type === 'income' ? COLORS.WHITE : COLORS.SUCCESS} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === 'income' && styles.typeButtonTextActive
                  ]}>
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

                {/* Date */}
                <DatePicker
              label="Date"
              value={formData.date}
              onDateChange={(date) => handleInputChange('date', formatDateForInput(date))}
              error={errors.date}
            />

            {/* Account Selection */}
            <CustomDropdown
              label="Account"
              value={formData.personId}
              onValueChange={(value) => handleInputChange('personId', value)}
              items={persons}
              placeholder="Select an account"
              error={errors.personId}
              valueKey="id"
              displayKey="name"
            />

            {/* Title */}
            <CustomInput
              label="Title"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter transaction title"
              error={errors.title}
            />

            {/* Amount */}
            <CustomInput
              label="Amount"
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              placeholder="Enter amount"
              keyboardType="numeric"
              error={errors.amount}
            />

            {/* Category */}
            <CustomDropdown
              label="Category"
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              items={categories.map(category => ({ 
                id: category.id, 
                name: category.name,
                color: category.color,
                icon: category.icon 
              }))}
              placeholder="Select category"
              error={errors.category}
              valueKey="id"
              displayKey="name"
            />

        

            {/* Notes */}
            <CustomInput
              label="Notes (Optional)"
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Add any notes about this transaction"
              multiline
              numberOfLines={3}
              error={errors.notes}
            />

            {/* Attachment */}
            <View style={styles.attachmentSection}>
              <Text style={styles.sectionLabel}>Attachment (Optional)</Text>
              
              {formData.attachment ? (
                <View style={styles.attachmentPreview}>
                  <Image 
                    source={{ uri: formData.attachment.uri }} 
                    style={styles.attachmentImage} 
                  />
                  <View style={styles.attachmentActions}>
                    <TouchableOpacity
                      style={styles.attachmentButton}
                      onPress={openImageViewer}
                    >
                      <Icon name="visibility" size={20} color={COLORS.PRIMARY} />
                      <Text style={styles.attachmentButtonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attachmentButton, styles.removeButton]}
                      onPress={removeAttachment}
                    >
                      <Icon name="delete" size={20} color={COLORS.ERROR} />
                      <Text style={[styles.attachmentButtonText, styles.removeButtonText]}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.attachmentButtons}>
                  <TouchableOpacity
                    style={styles.attachmentButton}
                    onPress={() => handleImagePicker('camera')}
                  >
                    <Icon name="camera-alt" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.attachmentButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.attachmentButton}
                    onPress={() => handleImagePicker('library')}
                  >
                    <Icon name="photo-library" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.attachmentButtonText}>Choose Photo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <CustomButton
              title={isEditing ? 'Update Transaction' : 'Add Transaction'}
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImageViewer
        visible={showImageViewer}
        attachment={formData.attachment}
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
  },
  placeholder: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.SEMI_TRANSPARENT_WHITE,
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
  form: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    ...SHADOWS.MD,
  },
  typeSelector: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
  },
  typeButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  typeButtonTextActive: {
    color: COLORS.WHITE,
  },
  attachmentSection: {
    marginBottom: 20,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    gap: 8,
  },
  removeButton: {
    borderColor: COLORS.ERROR,
  },
  attachmentButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  removeButtonText: {
    color: COLORS.ERROR,
  },
  attachmentPreview: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.GRAY_50,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  attachmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default AddTransactionScreen;
