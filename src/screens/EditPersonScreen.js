import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, MOCK_DATA } from '../constants';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const EditPersonScreen = ({ navigation, route }) => {
  const { personId } = route.params;
  
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (personId) {
      const person = MOCK_DATA.PERSONS.find(p => p.id === personId);
      if (person) {
        setFormData({
          name: person.name,
          notes: person.notes || '',
        });
      }
      setInitialLoading(false);
    }
  }, [personId]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - navigate back
      Alert.alert(
        'Success',
        'Person updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update person. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to delete this person? This will also delete all associated transactions.',
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
          <Text style={styles.title}>Edit Person</Text>
          <Text style={styles.subtitle}>
            Update person information
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter person's full name"
            autoCapitalize="words"
            autoCorrect={false}
            error={errors.name}
          />

          <CustomInput
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Add any notes about this person"
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
              title="Update Person"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.deleteSection}>
            <CustomButton
              title="Delete Person"
              onPress={handleDelete}
              variant="outline"
              style={styles.deleteButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});

export default EditPersonScreen;
