import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { formatDate, formatTime, formatDateForInput } from '../utils';

// Import date picker based on platform
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({
  label,
  value,
  onDateChange,
  placeholder = 'Select Date',
  error,
  maximumDate,
  minimumDate,
  mode = 'date',
  disabled = false,
  style,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [isPressed, setIsPressed] = useState(false);

  const handleDateChange = (event, date) => {
    // On Android, the picker automatically closes when a date is selected
    // On iOS, we need to manually close it
    if (Platform.OS === 'ios') {
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
        return;
      }
    }
    
    if (date) {
      setSelectedDate(date);
      onDateChange(date);
      setShowDatePicker(false);
    }
  };

  const showDatePickerModal = () => {
    if (disabled) return;
    setShowDatePicker(true);
  };

  const dismissDatePicker = () => {
    setShowDatePicker(false);
  };

  const getDisplayValue = () => {
    if (!value) return '';
    
    if (mode === 'date') {
      return formatDate(value, 'long');
    } else if (mode === 'time') {
      return formatTime(value);
    } else if (mode === 'datetime') {
      return `${formatDate(value, 'long')} ${formatTime(value)}`;
    }
    
    return value;
  };

  const getIconName = () => {
    if (mode === 'time') return 'access-time';
    return 'calendar-today';
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[
          styles.datePickerButton, 
          disabled && styles.disabled,
          error && styles.error,
          isPressed && styles.pressed
        ]} 
        onPress={showDatePickerModal}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <View style={styles.inputContainer}>
          <Text style={[
            styles.inputText,
            !getDisplayValue() && styles.placeholderText,
            getDisplayValue() && styles.selectedText
          ]}>
            {getDisplayValue() || placeholder}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon 
            name={getIconName()} 
            size={24} 
            color={disabled ? COLORS.TEXT_TERTIARY : (getDisplayValue() ? COLORS.SUCCESS : COLORS.PRIMARY)} 
          />
        </View>
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Date Picker Modal - Works on both Android and iOS */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={mode}
          display={Platform.OS === 'ios' ? 'default' : 'calendar'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.WHITE,
    minHeight: 48,
    ...SHADOWS.SM,
  },
  disabled: {
    backgroundColor: COLORS.GRAY_100,
    borderColor: COLORS.BORDER_LIGHT,
    opacity: 0.6,
  },
  error: {
    borderColor: COLORS.ERROR,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: COLORS.GRAY_50,
    transform: [{ scale: 0.98 }],
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  placeholderText: {
    color: COLORS.TEXT_TERTIARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.NORMAL,
  },
  selectedText: {
    color: COLORS.SUCCESS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  iconContainer: {
    justifyContent: 'center',
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
    marginLeft: SPACING.XS,
  },
});

export default DatePicker;
