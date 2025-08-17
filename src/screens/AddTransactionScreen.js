import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, MOCK_DATA } from '../constants';
import CustomInput from '../components/CustomInput';
import CustomDropdown from '../components/CustomDropdown';
import CustomButton from '../components/CustomButton';
import ImageViewer from '../components/ImageViewer';
import DatePicker from '../components/DatePicker';
import { formatDateForInput } from '../utils';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddTransactionScreen = ({ navigation, route }) => {
  const person = route.params?.person;
  
  const [formData, setFormData] = useState({
    type: 'expense',
    personId: person?.id || '',
    amount: '',
    category: '',
    notes: '',
    date: formatDateForInput(new Date()),
    attachment: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.personId) {
      newErrors.personId = 'Please select a person';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - navigate back
      Alert.alert(
        'Success',
        'Transaction added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
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

  const handleTypeToggle = () => {
    const newType = formData.type === 'income' ? 'expense' : 'income';
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDateForInput(date);
    setFormData(prev => ({ ...prev, date: formattedDate }));
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Add Attachment',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert('Permission Denied', 'Camera permission is required to take photos');
              return;
            }

            const options = {
              mediaType: 'photo',
              quality: 0.8,
              includeBase64: false,
              saveToPhotos: false,
            };

            launchCamera(options, (response) => {
              if (response.didCancel) {
                return;
              }
              if (response.error) {
                Alert.alert('Error', 'Failed to take photo');
                return;
              }
              if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setFormData(prev => ({
                  ...prev,
                  attachment: {
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || 'camera_photo.jpg',
                  },
                }));
              }
            });
          },
        },
        {
          text: 'Photo Library',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              quality: 0.8,
              includeBase64: false,
              selectionLimit: 1,
            };

            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                return;
              }
              if (response.error) {
                Alert.alert('Error', 'Failed to select photo');
                return;
              }
              if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setFormData(prev => ({
                  ...prev,
                  attachment: {
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || 'selected_photo.jpg',
                  },
                }));
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const removeAttachment = () => {
    setFormData(prev => ({ ...prev, attachment: null }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Transaction</Text>
          {person && (
            <Text style={styles.subtitle}>
              Adding transaction for {person.name}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          {/* Transaction Type Toggle */}
          <View style={styles.typeToggleContainer}>
            <Text style={styles.typeLabel}>Transaction Type</Text>
            <View style={styles.typeToggle}>
              <CustomButton
                title="Income"
                variant={formData.type === 'income' ? 'primary' : 'outline'}
                size="small"
                onPress={() => handleTypeToggle()}
                style={styles.typeButton}
              />
              <CustomButton
                title="Expense"
                variant={formData.type === 'expense' ? 'primary' : 'outline'}
                size="small"
                onPress={() => handleTypeToggle()}
                style={styles.typeButton}
              />
            </View>
          </View>

          <CustomInput
            label="Amount"
            value={formData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount}
          />

          <CustomDropdown
            label="Person"
            value={formData.personId}
            onValueChange={(value) => handleInputChange('personId', value)}
            items={MOCK_DATA.PERSONS.map(p => ({ id: p.id, name: p.name }))}
            placeholder="Select a person"
            searchable={true}
            error={errors.personId}
            displayKey="name"
            valueKey="id"
          />

          <CustomDropdown
            label="Category"
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            items={MOCK_DATA.CATEGORIES}
            placeholder="Select a category"
            searchable={true}
            error={errors.category}
          />

          <CustomInput
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Add any notes about this transaction"
            multiline
            numberOfLines={3}
            autoCapitalize="sentences"
          />

          <DatePicker
            label="Date"
            value={formData.date}
            onDateChange={handleDateChange}
            placeholder="Select Date"
            maximumDate={new Date()}
            error={errors.date}
          />

          {/* Attachment Section */}
          <View style={styles.attachmentContainer}>
            <Text style={styles.attachmentLabel}>Attachment (Optional)</Text>
            {formData.attachment ? (
              <View style={styles.attachmentPreview}>
                <Image source={{ uri: formData.attachment.uri }} style={styles.attachmentImage} />
                <View style={styles.attachmentActions}>
                  <TouchableOpacity
                    style={styles.attachmentActionButton}
                    onPress={() => setShowImageViewer(true)}
                  >
                    <Icon name="visibility" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.attachmentActionText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.attachmentActionButton}
                    onPress={removeAttachment}
                  >
                    <Icon name="delete" size={20} color={COLORS.ERROR} />
                    <Text style={styles.attachmentActionText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addAttachmentButton} onPress={handleImagePicker}>
                <Icon name="add-photo-alternate" size={32} color={COLORS.PRIMARY} />
                <Text style={styles.addAttachmentText}>Add Receipt or Photo</Text>
                <Text style={styles.addAttachmentSubtext}>Tap to add an attachment</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
            />
            <CustomButton
              title="Add Transaction"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Image Viewer Modal */}
      {showImageViewer && formData.attachment && (
        <ImageViewer
          imageUri={formData.attachment.uri}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      {/* Date Picker Modal */}
      {/* The DateTimePicker component is not imported, so this block is removed. */}
    </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingBottom: SPACING.XL,
  },
  header: {
    padding: SPACING.MD,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  form: {
    padding: SPACING.MD,
  },
  typeToggleContainer: {
    marginBottom: SPACING.MD,
  },
  typeLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  typeButton: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginTop: SPACING.LG,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  attachmentContainer: {
    marginBottom: SPACING.MD,
  },
  attachmentLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  addAttachmentButton: {
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_50,
  },
  addAttachmentText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.PRIMARY,
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  addAttachmentSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  attachmentPreview: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    backgroundColor: COLORS.WHITE,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  attachmentActions: {
    flexDirection: 'row',
    padding: SPACING.SM,
    gap: SPACING.SM,
  },
  attachmentActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    backgroundColor: COLORS.GRAY_100,
    gap: SPACING.XS,
  },
  attachmentActionText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
});

export default AddTransactionScreen;
