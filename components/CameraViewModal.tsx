import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing } from '../constants/theme';

type Props = {
  visible: boolean;
  onCapture: (uri: string) => void;
  onClose: () => void;
};

/**
 * In-app camera viewfinder using CameraView from expo-camera.
 * Supports camera flipping (back/front), shutter capture, and close.
 */
export function CameraViewModal({ visible, onCapture, onClose }: Props) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (e) {
      console.error('Failed to take picture:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Top Bar Overlay */}
          <View style={styles.topBar}>
            <Pressable
              onPress={onClose}
              style={styles.circleBtn}
              accessibilityRole="button"
              accessibilityLabel="ปิดกล้อง"
              testID="camera-close-btn"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={toggleFacing}
              style={styles.circleBtn}
              accessibilityRole="button"
              accessibilityLabel="สลับกล้องหน้าหลัง"
              testID="camera-flip-btn"
            >
              <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Bottom Bar with Shutter */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={handleCapture}
              disabled={isCapturing}
              style={({ pressed }) => [
                styles.shutterOuter,
                pressed && styles.shutterPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="กดชัตเตอร์ถ่ายภาพ"
              testID="camera-shutter-btn"
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.shutterInner} />
              )}
            </Pressable>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingTop: 54,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: rounded.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: rounded.full,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: rounded.full,
    backgroundColor: '#FFFFFF',
  },
  shutterPressed: {
    transform: [{ scale: 0.92 }],
  },
});
