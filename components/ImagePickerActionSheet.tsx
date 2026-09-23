import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing, elevation } from '../constants/theme';

type Props = {
  visible: boolean;
  onTakePhoto: () => void;
  onChooseLibrary: () => void;
  onClose: () => void;
};

/**
 * Custom cross-platform Action Sheet for image source selection.
 * Styled with Aura Mobile design tokens.
 */
export function ImagePickerActionSheet({
  visible,
  onTakePhoto,
  onChooseLibrary,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheetContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.indicator} />
          <Text style={styles.sheetTitle}>เลือกภาพประกอบกิจกรรม</Text>
          <Text style={styles.sheetSubtitle}>
            ถ่ายภาพใหม่หรือเลือกจากคลังภาพในอุปกรณ์ของคุณ
          </Text>

          <View style={styles.optionsList}>
            {/* Take photo */}
            <Pressable
              style={({ pressed }) => [styles.optionBtn, pressed && styles.pressed]}
              onPress={onTakePhoto}
              accessibilityRole="button"
              accessibilityLabel="ถ่ายรูปด้วยกล้อง"
              testID="action-take-photo"
            >
              <View style={[styles.iconWrapper, { backgroundColor: '#DCF2E8' }]}>
                <Ionicons name="camera" size={20} color={colors.primary} />
              </View>
              <Text style={styles.optionText}>ถ่ายรูปด้วยกล้อง</Text>
            </Pressable>

            {/* Choose from library */}
            <Pressable
              style={({ pressed }) => [styles.optionBtn, pressed && styles.pressed]}
              onPress={onChooseLibrary}
              accessibilityRole="button"
              accessibilityLabel="เลือกจากคลังภาพ"
              testID="action-choose-library"
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.secondaryContainer }]}>
                <Ionicons name="images" size={20} color={colors.secondary} />
              </View>
              <Text style={styles.optionText}>เลือกจากคลังภาพ</Text>
            </Pressable>
          </View>

          {/* Cancel */}
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="ยกเลิก"
            testID="action-cancel"
          >
            <Text style={styles.cancelText}>ยกเลิก</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: rounded.xl,
    borderTopRightRadius: rounded.xl,
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    ...elevation.card,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: rounded.full,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: colors.outline,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainerLow,
    minHeight: 52,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: rounded.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainerHighest,
    marginTop: spacing.md,
    minHeight: 48,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  pressed: {
    opacity: 0.7,
  },
});
