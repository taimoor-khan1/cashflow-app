import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING, SHADOWS } from '../constants';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'secondary') {
      baseStyle.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') {
      baseTextStyle.push(styles.outlineText);
    }
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.PRIMARY : COLORS.WHITE}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    ...SHADOWS.MD,
  },
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: COLORS.SECONDARY,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    ...SHADOWS.SM,
  },
  disabled: {
    backgroundColor: COLORS.GRAY_300,
    borderColor: COLORS.GRAY_300,
    ...SHADOWS.SM,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  text: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    textAlign: 'center',
  },
  smallText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
  },
  largeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
  },
  outlineText: {
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
  },
  disabledText: {
    color: COLORS.GRAY_600,
  },
});

export default CustomButton;
