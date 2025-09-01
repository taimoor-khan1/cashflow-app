import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import CustomButton from './CustomButton';

const { width, height } = Dimensions.get('window');

const Modal = ({
  visible,
  onClose,
  title,
  message,
  type = 'info', // 'info', 'success', 'warning', 'error', 'confirm'
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
  icon,
  children,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getModalStyle = () => {
    switch (size) {
      case 'small':
        return { width: width * 0.8, maxWidth: 300 };
      case 'large':
        return { width: width * 0.95, maxWidth: 500 };
      case 'medium':
      default:
        return { width: width * 0.9, maxWidth: 400 };
    }
  };

  const getTypeStyle = () => {
    switch (type) {
      case 'success':
        return { 
          icon: icon || 'check-circle', 
          iconColor: COLORS.SUCCESS,
          titleColor: COLORS.SUCCESS 
        };
      case 'error':
        return { 
          icon: icon || 'error', 
          iconColor: COLORS.ERROR,
          titleColor: COLORS.ERROR 
        };
      case 'warning':
        return { 
          icon: icon || 'warning', 
          iconColor: COLORS.WARNING || '#FF9800',
          titleColor: COLORS.WARNING || '#FF9800'
        };
      case 'confirm':
        return { 
          icon: icon || 'help', 
          iconColor: COLORS.PRIMARY,
          titleColor: COLORS.TEXT_PRIMARY 
        };
      case 'info':
      default:
        return { 
          icon: icon || 'info', 
          iconColor: COLORS.PRIMARY,
          titleColor: COLORS.TEXT_PRIMARY 
        };
    }
  };

  const typeStyle = getTypeStyle();
  const modalStyle = getModalStyle();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                modalStyle,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Icon name={typeStyle.icon} size={32} color={typeStyle.iconColor} />
                </View>
                <Text style={[styles.title, { color: typeStyle.titleColor }]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {message && (
                  <Text style={styles.message}>{message}</Text>
                )}
                {children}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                {showCancel && (
                  <CustomButton
                    title={cancelText}
                    onPress={handleCancel}
                    style={[styles.button, styles.cancelButton]}
                    textStyle={styles.cancelButtonText}
                  />
                )}
                <CustomButton
                  title={confirmText}
                  onPress={handleConfirm}
                  style={[styles.button, styles.confirmButton]}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  modal: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.XL,
    ...SHADOWS.XL,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  iconContainer: {
    marginRight: SPACING.MD,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  closeButton: {
    padding: SPACING.XS,
  },
  content: {
    padding: SPACING.LG,
  },
  message: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.LG,
    paddingTop: 0,
    gap: SPACING.MD,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
  },
});

export default Modal;
