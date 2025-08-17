import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

const Card = ({
  children,
  style,
  onPress,
  disabled = false,
  variant = 'default',
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: COLORS.CARD_BACKGROUND,
      borderRadius: BORDER_RADIUS.LG,
      padding: SPACING.MD,
    };

    const variantStyles = {
      default: {
        ...SHADOWS.SM,
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT,
      },
      elevated: {
        ...SHADOWS.LG,
        borderWidth: 0,
      },
      outlined: {
        ...SHADOWS.SM,
        borderWidth: 2,
        borderColor: COLORS.PRIMARY,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

export default Card;
