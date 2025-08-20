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
          source={{ uri: attachment.uri }}
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
