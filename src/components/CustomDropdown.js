import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

const CustomDropdown = ({
  label,
  value,
  onValueChange,
  items,
  placeholder = 'Select an option',
  searchable = false,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  displayKey,
  valueKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const handleOpen = () => {
    setIsOpen(true);
    setSearchText('');
    setFilteredItems(items);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  const handleSelect = (item) => {
    onValueChange(item);
    handleClose();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => {
        const searchText = displayKey ? item[displayKey] : item;
        return searchText.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredItems(filtered);
    }
  };

  const selectedItem = items.find(item => {
    if (valueKey) {
      return item[valueKey] === value;
    }
    return item === value;
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.dropdownButtonError,
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          !selectedItem && styles.placeholderText
        ]}>
          {selectedItem ? (displayKey ? selectedItem[displayKey] : selectedItem) : placeholder}
        </Text>
        <Icon 
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color={COLORS.GRAY_500} 
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="close" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={COLORS.GRAY_500} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={handleSearch}
                  placeholderTextColor={COLORS.GRAY_500}
                />
              </View>
            )}

            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    (valueKey ? item[valueKey] === value : item === value) && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleSelect(valueKey ? item[valueKey] : item)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    (valueKey ? item[valueKey] === value : item === value) && styles.dropdownItemTextSelected
                  ]}>
                    {displayKey ? item[displayKey] : item}
                  </Text>
                  {(valueKey ? item[valueKey] === value : item === value) && (
                    <Icon name="check" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    minHeight: 44,
    ...SHADOWS.SM,
  },
  dropdownButtonError: {
    borderColor: COLORS.ERROR,
    borderWidth: 2,
  },
  dropdownText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.GRAY_500,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
    marginLeft: SPACING.SM,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    width: '90%',
    maxHeight: '80%',
    ...SHADOWS.LG,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: SPACING.XS,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.SM,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT + '20',
  },
  dropdownItemText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    color: COLORS.TEXT_PRIMARY,
  },
  dropdownItemTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
});

export default CustomDropdown;
