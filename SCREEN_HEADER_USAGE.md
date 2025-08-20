# ScreenHeader Component Usage Guide

## Overview
The `ScreenHeader` component provides a consistent header across all screens while maintaining flexibility for different design requirements. It automatically handles status bar management, back buttons, and different styling variants.

## Basic Usage

### 1. Import the Component
```javascript
import ScreenHeader from '../components/ScreenHeader';
```

### 2. Basic Gradient Header (Default)
```javascript
<ScreenHeader
  title="Screen Title"
  subtitle="Optional subtitle"
  onBack={() => navigation.goBack()}
/>
```

### 3. Plain Header (White Background)
```javascript
<ScreenHeader
  title="Screen Title"
  variant="plain"
  onBack={() => navigation.goBack()}
/>
```

### 4. Transparent Header (No Background)
```javascript
<ScreenHeader
  title="Screen Title"
  variant="transparent"
  onBack={() => navigation.goBack()}
/>
```

## Advanced Usage

### 5. Dashboard Header (No Back Button)
```javascript
<ScreenHeader
  title="Dashboard"
  isDashboard={true}
  showBack={false}
/>
```

### 6. Auth Screen Header (Different Padding)
```javascript
<ScreenHeader
  title="Login"
  variant="gradient"
  isAuth={true}
  showBack={false}
/>
```

### 7. Custom Gradient Colors
```javascript
<ScreenHeader
  title="Custom Header"
  gradientColors={['#FF6B6B', '#4ECDC4']}
  onBack={() => navigation.goBack()}
/>
```

### 8. With Right Button
```javascript
<ScreenHeader
  title="Profile"
  onBack={() => navigation.goBack()}
  onRightPress={() => navigation.navigate('EditProfile')}
  rightIcon="edit"
/>
```

### 9. Custom Styling
```javascript
<ScreenHeader
  title="Custom Style"
  style={{ marginBottom: 20 }}
  titleStyle={{ fontSize: 28 }}
  backButtonStyle={{ backgroundColor: 'red' }}
/>
```

## Props Reference

### Basic Props
- `title` (string, required): Header title
- `subtitle` (string, optional): Header subtitle
- `onBack` (function, optional): Back button press handler
- `onRightPress` (function, optional): Right button press handler
- `rightIcon` (string, optional): Right button icon name
- `rightText` (string, optional): Right button text

### Style Variants
- `variant` (string): 'gradient' | 'plain' | 'transparent' (default: 'gradient')
- `gradientColors` (array, optional): Custom gradient colors
- `backgroundColor` (string, optional): Background color for plain variant

### Layout Options
- `showBack` (boolean): Show/hide back button (default: true)
- `showStatusBar` (boolean): Show/hide status bar (default: true)
- `statusBarStyle` (string): Status bar style (default: 'light-content')
- `statusBarBackgroundColor` (string, optional): Status bar background color

### Special Cases
- `isDashboard` (boolean): Dashboard-specific padding (default: false)
- `isAuth` (boolean): Auth screen-specific padding (default: false)

### Custom Styling
- `style` (object, optional): Custom header container styles
- `titleStyle` (object, optional): Custom title text styles
- `subtitleStyle` (object, optional): Custom subtitle text styles
- `backButtonStyle` (object, optional): Custom back button styles
- `rightButtonStyle` (object, optional): Custom right button styles

## Integration Examples

### With Existing Headers
You can add the ScreenHeader alongside existing headers without disturbing the current design:

```javascript
return (
  <View style={styles.container}>
    {/* Universal Header Component */}
    <ScreenHeader
      title="Screen Title"
      variant="gradient"
      onBack={() => navigation.goBack()}
      style={styles.universalHeader}
    />
    
    {/* Original Header Section - Kept for existing design */}
    <LinearGradient colors={COLORS.GRADIENT_PRIMARY} style={styles.header}>
      {/* Your existing header content */}
    </LinearGradient>
    
    {/* Rest of your screen content */}
  </View>
);
```

### Positioning Styles
```javascript
// For absolute positioning (overlay)
universalHeader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}

// For inline positioning (flow with content)
universalHeader: {
  marginBottom: SPACING.MD,
}
```

## Benefits

1. **Consistency**: All screens have the same header structure and behavior
2. **Flexibility**: Multiple variants and customization options
3. **Maintainability**: Single component to update header logic
4. **Non-Disruptive**: Can be added alongside existing headers
5. **Status Bar Management**: Automatic status bar handling
6. **Responsive**: Adapts to different screen sizes and orientations

## Migration Strategy

1. **Phase 1**: Add ScreenHeader alongside existing headers
2. **Phase 2**: Gradually replace existing header logic
3. **Phase 3**: Remove old header code and use only ScreenHeader

This approach ensures no disruption to existing designs while providing a path to consistent headers across the app.
