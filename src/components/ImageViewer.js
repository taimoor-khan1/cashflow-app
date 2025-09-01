import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING } from '../constants';

const { width, height } = Dimensions.get('window');

const ImageViewer = ({ visible, attachment, onClose }) => {
  if (!visible || !attachment) return null;

  console.log('ImageViewer - Received attachment:', attachment);
  console.log('ImageViewer - Attachment type:', typeof attachment);

  // Handle different attachment data structures
  const getImageSource = (attachment) => {
    if (typeof attachment === 'string') {
      console.log('ImageViewer - String attachment, using as URI');
      return { uri: attachment };
    }
    
    if (attachment && typeof attachment === 'object') {
      if (attachment.uri) {
        console.log('ImageViewer - Object with uri:', attachment.uri);
        return { uri: attachment.uri };
      }
      if (attachment.url) {
        console.log('ImageViewer - Object with url:', attachment.url);
        return { uri: attachment.url };
      }
      if (attachment.path) {
        console.log('ImageViewer - Object with path:', attachment.path);
        return { uri: attachment.path };
      }
    }
    
    console.warn('ImageViewer - Invalid attachment data for ImageViewer:', attachment);
    return null;
  };

  const imageSource = getImageSource(attachment);
  
  if (!imageSource) {
    console.error('ImageViewer - Cannot display attachment - invalid source:', attachment);
    return null;
  }

  // Additional safety check for the Image component
  if (!imageSource.uri) {
    console.error('ImageViewer - Image source has no URI:', imageSource);
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar hidden />
        
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={28} color={COLORS.WHITE} />
        </TouchableOpacity>
        
        {/* Image */}
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
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
    backgroundColor: COLORS.OVERLAY,
    borderRadius: 20,
    padding: SPACING.SM,
  },
  image: {
    width: width,
    height: height,
  },
});

export default ImageViewer;
