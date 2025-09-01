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
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ImageViewer from '../components/ImageViewer';
import Modal from '../components/Modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import dataService from '../services/dataService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../navigation/AppNavigator';

const EditPersonScreen = ({ navigation, route }) => {
  const { personId } = route.params;
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    attachment: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (personId) {
      loadPersonData();
    }
  }, [personId]);

  const loadPersonData = async () => {
    try {
      setInitialLoading(true);
      const personsData = await dataService.getPersons();
      const person = personsData.find(p => p.id === personId);
      
      if (person) {
        setFormData({
          name: person.name,
          notes: person.notes || '',
        });
      } else {
        showError('Account not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading person data:', error);
      showError('Failed to load account data');
      navigation.goBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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
      await dataService.updatePerson(personId, {
        name: formData.name.trim(),
        notes: formData.notes.trim(),
        updatedAt: new Date().toISOString(),
      });

      // Success - navigate back
      showSuccess('Account updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating person:', error);
      showError('Failed to update account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerson = () => {
    setShowDeleteModal(true);
  };

  const confirmDeletePerson = async () => {
    try {
      await dataService.deletePerson(personId);
      showSuccess('Account deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting person:', error);
      showError('Failed to delete account. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Edit Account</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.headerSubtitle}>
          Update account information
        </Text>
      </LinearGradient>
      
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter account's full name"
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.name}
            />

            <CustomInput
              label="Notes (Optional)"
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Add any notes about this account"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.cancelButton}
              />
              <CustomButton
                title="Update Account"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.deleteSection}>
              <CustomButton
                title="Delete Account"
                onPress={handleDeletePerson}
                variant="outline"
                textStyle={styles.deleteButtonText}
                style={styles.deleteButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        message="Are you sure you want to delete this account? This will also delete all associated transactions."
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={confirmDeletePerson}
        onCancel={() => setShowDeleteModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: Platform.OS === 'ios' ? SPACING.XL : SPACING.MD,
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderBottomLeftRadius: BORDER_RADIUS.XL,
    borderBottomRightRadius: BORDER_RADIUS.XL,
    marginBottom: SPACING.MD,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  backButton: {
    padding: SPACING.SM,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: SPACING.MD,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  form: {
    padding: SPACING.MD,
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
  deleteSection: {
    marginTop: SPACING.XL,
    paddingTop: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,


  },
  deleteButtonText: {
    color: COLORS.WHITE,
  },
});

export default EditPersonScreen;
