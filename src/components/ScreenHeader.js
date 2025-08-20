import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

/**
 * Universal ScreenHeader Component
 * 
 * This component provides a consistent header across all screens while maintaining
 * flexibility for different design requirements.
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Basic Gradient Header (default):
 *    <ScreenHeader
 *      title="Screen Title"
 *      subtitle="Optional subtitle"
 *      onBack={() => navigation.goBack()}
 *    />
 * 
 * 2. Plain Header (white background):
 *    <ScreenHeader
 *      title="Screen Title"
 *      variant="plain"
 *      onBack={() => navigation.goBack()}
 *    />
 * 
 * 3. Transparent Header (no background):
 *    <ScreenHeader
 *      title="Screen Title"
 *      variant="transparent"
 *      onBack={() => navigation.goBack()}
 *    />
 * 
 * 4. Dashboard Header (no back button):
 *    <ScreenHeader
 *      title="Dashboard"
 *      isDashboard={true}
 *      showBack={false}
 *    />
 * 
 * 5. Auth Screen Header (different padding):
 *    <ScreenHeader
 *      title="Login"
 *      variant="gradient"
 *      isAuth={true}
 *      showBack={false}
 *    />
 * 
 * 6. Custom Gradient Colors:
 *    <ScreenHeader
 *      title="Custom Header"
 *      gradientColors={['#FF6B6B', '#4ECDC4']}
 *      onBack={() => navigation.goBack()}
 *    />
 * 
 * 7. With Right Button:
 *    <ScreenHeader
 *      title="Profile"
 *      onBack={() => navigation.goBack()}
 *      onRightPress={() => navigation.navigate('EditProfile')}
 *      rightIcon="edit"
 *    />
 * 
 * 8. Custom Styling:
 *    <ScreenHeader
 *      title="Custom Style"
 *      style={{ marginBottom: 20 }}
 *      titleStyle={{ fontSize: 28 }}
 *      backButtonStyle={{ backgroundColor: 'red' }}
 *    />
 */
const ScreenHeader = ({
  // Basic props
  title,
  subtitle,
  onBack,
  onRightPress,
  rightIcon,
  rightText,
  
  // Style customization
  variant = 'gradient', // 'gradient', 'plain', 'transparent'
  gradientColors,
  backgroundColor,
  
  // Layout options
  showBack = true,
  showStatusBar = true,
  statusBarStyle = 'light-content',
  statusBarBackgroundColor,
  
  // Custom styling
  style,
  titleStyle,
  subtitleStyle,
  backButtonStyle,
  rightButtonStyle,
  
  // Special cases
  isDashboard = false,
  isAuth = false,
}) => {
  // Default gradient colors
  const defaultGradientColors = gradientColors || COLORS.GRADIENT_PRIMARY;
  const defaultBackgroundColor = backgroundColor || COLORS.WHITE;
  
  // Status bar height calculation
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
  const headerPaddingTop = isDashboard ? 60 : (isAuth ? 50 : statusBarHeight + 10);
  
  const HeaderContent = () => (
    <View style={[styles.headerContent, { paddingTop: headerPaddingTop }]}>
      {showBack && onBack && (
        <TouchableOpacity 
          onPress={onBack} 
          style={[
            styles.backButton, 
            backButtonStyle,
            variant === 'transparent' && styles.backButtonTransparent
          ]}
        >
          <Icon 
            name="arrow-back" 
            size={24} 
            color={variant === 'transparent' ? COLORS.TEXT_PRIMARY : COLORS.WHITE} 
          />
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        <Text style={[
          styles.title, 
          titleStyle,
          variant === 'transparent' && styles.titleTransparent
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.subtitle, 
            subtitleStyle,
            variant === 'transparent' && styles.subtitleTransparent
          ]}>
            {subtitle}
          </Text>
        )}
      </View>

      {(onRightPress && (rightIcon || rightText)) ? (
        <TouchableOpacity 
          onPress={onRightPress} 
          style={[
            styles.rightButton, 
            rightButtonStyle,
            variant === 'transparent' && styles.rightButtonTransparent
          ]}
        >
          {rightIcon ? (
            <Icon 
              name={rightIcon} 
              size={24} 
              color={variant === 'transparent' ? COLORS.TEXT_PRIMARY : COLORS.WHITE} 
            />
          ) : (
            <Text style={[
              styles.rightText, 
              variant === 'transparent' && styles.rightTextTransparent
            ]}>
              {rightText}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.headerPlaceholder} />
      )}
    </View>
  );

  // Render based on variant
  if (variant === 'gradient') {
    return (
      <>
        {showStatusBar && (
          <StatusBar 
            barStyle={statusBarStyle} 
            backgroundColor="transparent" 
            translucent 
          />
        )}
        <LinearGradient
          colors={defaultGradientColors}
          style={[styles.headerGradient, style]}
        >
          <HeaderContent />
        </LinearGradient>
      </>
    );
  }

  if (variant === 'transparent') {
    return (
      <>
        {showStatusBar && (
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor="transparent" 
            translucent 
          />
        )}
        <View style={[styles.headerTransparent, style]}>
          <HeaderContent />
        </View>
      </>
    );
  }

  // Plain variant
  return (
    <>
      {showStatusBar && (
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={statusBarBackgroundColor || defaultBackgroundColor} 
        />
      )}
      <View style={[
        styles.headerPlain, 
        { backgroundColor: defaultBackgroundColor }, 
        style
      ]}>
        <HeaderContent />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Gradient header styles
  headerGradient: {
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOWS.MD,
  },
  
  // Plain header styles
  headerPlain: {
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.SM,
  },
  
  // Transparent header styles
  headerTransparent: {
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  
  // Common header content
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Back button styles
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTransparent: {
    backgroundColor: COLORS.GRAY_100,
  },
  
  // Title container
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  // Title styles
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  titleTransparent: {
    color: COLORS.TEXT_PRIMARY,
  },
  
  // Subtitle styles
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.SEMI_TRANSPARENT_WHITE,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitleTransparent: {
    color: COLORS.TEXT_SECONDARY,
  },
  
  // Right button styles
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtonTransparent: {
    backgroundColor: COLORS.GRAY_100,
  },
  
  // Right text styles
  rightText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.WHITE,
  },
  rightTextTransparent: {
    color: COLORS.TEXT_PRIMARY,
  },
  
  // Placeholder for spacing
  headerPlaceholder: {
    width: 40,
  },
});

export default ScreenHeader;
