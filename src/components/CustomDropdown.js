import React, { useState, useRef, useEffect } from 'react';
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
  console.log('CustomDropdown: Rendering with items:', items?.length, 'label:', label);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Update filteredItems when items prop changes
  useEffect(() => {
    try {
      console.log('CustomDropdown: useEffect triggered, items:', items?.length);
      
      // Validate items array
      if (!items || !Array.isArray(items)) {
        console.warn('CustomDropdown: Invalid items prop:', items);
        setFilteredItems([]);
        return;
      }
      
      // Filter out invalid items
      const validItems = items.filter(item => {
        if (!item) return false;
        if (valueKey && !item[valueKey]) return false;
        if (displayKey && !item[displayKey]) return false;
        return true;
      });
      
      console.log('CustomDropdown: Valid items count:', validItems.length);
      setFilteredItems(validItems);
    } catch (error) {
      console.error('CustomDropdown: Error in useEffect:', error);
      setFilteredItems([]);
    }
  }, [items, valueKey, displayKey]);

  const handleOpen = () => {
    try {
      console.log('CustomDropdown: handleOpen called, items:', items?.length, 'filteredItems:', filteredItems?.length);
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.warn('CustomDropdown: Cannot open dropdown - no valid items');
        return; // Don't open if no items
      }
      
      if (!filteredItems || filteredItems.length === 0) {
        console.warn('CustomDropdown: Cannot open dropdown - no filtered items');
        return;
      }
      
      setIsOpen(true);
      setSearchText('');
    } catch (error) {
      console.error('CustomDropdown: Error in handleOpen:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  const handleSelect = (item) => {
    if (valueKey) {
      onValueChange(item[valueKey]);
    } else {
      onValueChange(item);
    }
    handleClose();
  };

  const handleSearch = (text) => {
    try {
      setSearchText(text);
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        setFilteredItems([]);
        return;
      }
      
      if (text.trim() === '') {
        setFilteredItems(items);
      } else {
        const filtered = items.filter(item => {
          if (!item) return false;
          try {
            const displayText = getDisplayText(item);
            return displayText.toLowerCase().includes(text.toLowerCase());
          } catch (error) {
            console.warn('CustomDropdown: Error filtering item:', error, item);
            return false;
          }
        });
        setFilteredItems(filtered);
      }
    } catch (error) {
      console.error('CustomDropdown: Error in handleSearch:', error);
      setFilteredItems([]);
    }
  };

  const selectedItem = (() => {
    try {
      if (!items || !Array.isArray(items) || items.length === 0) {
        return null;
      }
      
      return items.find(item => {
        if (!item) return false;
        try {
          if (valueKey) {
            return item[valueKey] === value;
          }
          return item === value;
        } catch (error) {
          console.warn('CustomDropdown: Error finding selected item:', error, item);
          return false;
        }
      });
    } catch (error) {
      console.error('CustomDropdown: Error in selectedItem logic:', error);
      return null;
    }
  })();

  const getDisplayText = (item) => {
    try {
      if (!item) return '';
      
      // If displayKey is provided, use it
      if (displayKey) {
        const displayValue = item[displayKey];
        if (displayValue !== undefined && displayValue !== null) {
          return String(displayValue);
        }
        return '';
      }
      
      // If no displayKey, try to convert item to string safely
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'number') {
        return String(item);
      }
      if (typeof item === 'object' && item !== null) {
        // If it's an object, try to find a reasonable display value
        if (item.name) return String(item.name);
        if (item.title) return String(item.title);
        if (item.label) return String(item.label);
        if (item.id) return String(item.id);
        // Fallback to JSON string (truncated)
        return JSON.stringify(item).substring(0, 50);
      }
      
      return String(item || '');
    } catch (error) {
      console.error('CustomDropdown: Error in getDisplayText:', error, item);
      return 'Error';
    }
  };

  console.log('CustomDropdown: Rendering component');
  
  try {
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
            {selectedItem ? getDisplayText(selectedItem) : placeholder}
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
          visible={isOpen && (filteredItems && filteredItems.length > 0)}
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
                data={filteredItems || []}
                keyExtractor={(item, index) => (item && item[valueKey]) ? item[valueKey].toString() : index.toString()}
                renderItem={({ item }) => {
                  if (!item) return null;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        (valueKey ? item[valueKey] === value : item === value) && styles.dropdownItemSelected
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        (valueKey ? item[valueKey] === value : item === value) && styles.dropdownItemTextSelected
                      ]}>
                        {getDisplayText(item)}
                      </Text>
                      {(valueKey ? item[valueKey] === value : item === value) && (
                        <Icon name="check" size={20} color={COLORS.PRIMARY} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
                style={styles.dropdownList}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No options available</Text>
                  </View>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  } catch (error) {
    console.error('CustomDropdown: Critical error in render:', error);
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        <View style={[styles.dropdownButton, { backgroundColor: COLORS.GRAY_100 }]}>
          <Text style={styles.dropdownText}>
            Error loading dropdown
          </Text>
        </View>
      </View>
    );
  }
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
  emptyContainer: {
    paddingVertical: SPACING.MD,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.GRAY_500,
  },
});

export default CustomDropdown;