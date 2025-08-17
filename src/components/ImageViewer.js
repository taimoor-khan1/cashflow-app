import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING } from '../constants';

const { width, height } = Dimensions.get('window');

const ImageViewer = ({ imageUri, onClose }) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={28} color={COLORS.WHITE} />
      </TouchableOpacity>
      
      {/* Image */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.XL + 20,
    right: SPACING.LG,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: SPACING.SM,
  },
  image: {
    width: width,
    height: height,
  },
});

export default ImageViewer;
