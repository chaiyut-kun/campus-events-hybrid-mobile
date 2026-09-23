import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { ImagePickerActionSheet } from './ImagePickerActionSheet';
import { CameraViewModal } from './CameraViewModal';
import { CreateEventForm, CreateEventErrors } from '../types/createEvent';
import { validateEventImage } from '../utils/validateEventImage';
import { CampusEvent } from '../types/event';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newEvent: CampusEvent) => void;
};

const CATEGORIES = ['Technology', 'Academic', 'Sports', 'Entertainment'] as const;

const initialForm: CreateEventForm = {
  title: '',
  category: 'Technology',
  locationName: '',
  description: '',
  imageUri: null,
};

/**
 * Controlled Event Creation Modal with Just-In-Time Permissions,
 * Image Preview/Replace/Remove actions, and Upload Simulation.
 */
export function CreateEventModal({ visible, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateEventForm>(initialForm);
  const [errors, setErrors] = useState<CreateEventErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal sub-states
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Camera permissions hook from expo-camera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const formRef = useRef<CreateEventForm>(form);
  formRef.current = form;

  const locationRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const updateField = useCallback(
    (field: keyof CreateEventForm, value: any) => {
      const next = { ...formRef.current, [field]: value };
      formRef.current = next;
      setForm(next);
      if (errors[field]) {
        setErrors((prev) => {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        });
      }
    },
    [errors],
  );

  // ── Permission UX & Image Handlers ─────────────────────────────────

  const handleOpenActionSheet = () => {
    setIsActionSheetOpen(true);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  // 1. Choose from library
  const handleChooseLibrary = async () => {
    setIsActionSheetOpen(false);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        if (!permission.canAskAgain) {
          Alert.alert(
            'ต้องการสิทธิ์เข้าถึงคลังภาพ',
            'คุณได้ปฏิเสธการเข้าถึงคลังภาพ กรุณาเปิดการอนุญาตในหน้าการตั้งค่าเพื่อเลือกภาพประกอบกิจกรรม',
            [
              { text: 'ยกเลิก', style: 'cancel' },
              { text: 'เปิดการตั้งค่า', onPress: () => Linking.openSettings() },
            ],
          );
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const asset = result.assets[0];
        const validation = validateEventImage(asset.uri, asset.fileSize);
        if (!validation.valid && validation.error) {
          Alert.alert('ภาพไม่ถูกต้อง', validation.error);
          return;
        }
        updateField('imageUri', asset.uri);
      }
    } catch (e) {
      console.error('Error choosing library image:', e);
    }
  };

  // 2. Take photo with CameraView
  const handleTakePhoto = async () => {
    setIsActionSheetOpen(false);

    try {
      let currentPermission = cameraPermission;
      if (!currentPermission?.granted) {
        currentPermission = await requestCameraPermission();
      }

      if (!currentPermission.granted) {
        if (!currentPermission.canAskAgain) {
          Alert.alert(
            'ต้องการสิทธิ์เข้าถึงกล้อง',
            'คุณได้ปฏิเสธการเข้าถึงกล้องถ่ายภาพ กรุณาเปิดการอนุญาตในหน้าการตั้งค่าเพื่อถ่ายภาพประกอบกิจกรรม',
            [
              { text: 'ยกเลิก', style: 'cancel' },
              { text: 'เปิดการตั้งค่า', onPress: () => Linking.openSettings() },
            ],
          );
        }
        return;
      }

      setIsCameraOpen(true);
    } catch (e) {
      console.error('Error requesting camera permission:', e);
    }
  };

  const handleCameraCapture = (uri: string) => {
    setIsCameraOpen(false);
    updateField('imageUri', uri);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
  };

  const handleRemoveImage = () => {
    updateField('imageUri', null);
  };

  // ── Form Validation & Submit ───────────────────────────────────────

  const handleSubmit = async () => {
    const current = formRef.current;
    const newErrors: CreateEventErrors = {};

    if (!current.title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อกิจกรรม';
    }
    if (!current.locationName.trim()) {
      newErrors.locationName = 'กรุณากรอกสถานที่จัดกิจกรรม';
    }
    if (!current.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียดกิจกรรม';
    }
    if (!current.imageUri) {
      newErrors.imageUri = 'กรุณาถ่ายรูปหรือเลือกภาพประกอบกิจกรรม';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate upload delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}`,
      title: current.title.trim(),
      category: current.category,
      location: {
        name: current.locationName.trim(),
        latitude: 13.7563,
        longitude: 100.5018,
      },
      description: current.description.trim(),
      startsAt: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week from now
      imageUrl: current.imageUri || undefined,
    };

    onSubmit(newEvent);
    setIsSubmitting(false);
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>สร้างกิจกรรมใหม่</Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="ปิดหน้าต่างสร้างกิจกรรม"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="create-event-close-btn"
            >
              <Ionicons name="close" size={22} color={colors.onSurface} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Image Picker Section */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                ภาพประกอบกิจกรรม <Text style={styles.requiredMark}>*</Text>
              </Text>

              {form.imageUri ? (
                <View style={styles.previewContainer} testID="image-preview-container">
                  <Image source={{ uri: form.imageUri }} style={styles.previewImage} />
                  <View style={styles.previewActions}>
                    <Pressable
                      style={styles.previewActionBtn}
                      onPress={handleOpenActionSheet}
                      accessibilityRole="button"
                      accessibilityLabel="เปลี่ยนรูปภาพ"
                      testID="replace-image-btn"
                    >
                      <Ionicons name="camera-reverse" size={16} color={colors.primary} />
                      <Text style={styles.previewActionText}>เปลี่ยนรูป</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.previewActionBtn, styles.removeActionBtn]}
                      onPress={handleRemoveImage}
                      accessibilityRole="button"
                      accessibilityLabel="ลบรูปภาพ"
                      testID="remove-image-btn"
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                      <Text style={[styles.previewActionText, { color: colors.error }]}>
                        ลบรูป
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.uploadPlaceholder,
                    errors.imageUri ? styles.uploadPlaceholderError : undefined,
                  ]}
                  onPress={handleOpenActionSheet}
                  accessibilityRole="button"
                  accessibilityLabel="เพิ่มรูปภาพกิจกรรม"
                  testID="open-image-picker-btn"
                >
                  <View style={styles.cameraIconCircle}>
                    <Ionicons name="camera" size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadText}>แตะเพื่อถ่ายภาพหรือเลือกจากคลัง</Text>
                  <Text style={styles.uploadSubtext}>รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 5MB</Text>
                </Pressable>
              )}

              {errors.imageUri && (
                <View style={styles.errorRow} accessibilityRole="alert">
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{errors.imageUri}</Text>
                </View>
              )}
            </View>

            {/* Title */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                ชื่อกิจกรรม <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={form.title}
                onChangeText={(v) => updateField('title', v)}
                placeholder="เช่น การแข่งขันเขียนโปรแกรม Hackathon"
                placeholderTextColor={colors.outline}
                returnKeyType="next"
                onSubmitEditing={() => locationRef.current?.focus()}
                accessibilityLabel="ชื่อกิจกรรม"
                testID="input-event-title"
              />
              {errors.title && (
                <View style={styles.errorRow} accessibilityRole="alert">
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{errors.title}</Text>
                </View>
              )}
            </View>

            {/* Category Selector */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                หมวดหมู่ <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = form.category === cat;
                  return (
                    <Pressable
                      key={cat}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillActive,
                      ]}
                      onPress={() => updateField('category', cat)}
                      accessibilityRole="button"
                      accessibilityLabel={`หมวดหมู่ ${cat}`}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Location */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                สถานที่จัดงาน <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                ref={locationRef}
                style={[styles.input, errors.locationName && styles.inputError]}
                value={form.locationName}
                onChangeText={(v) => updateField('locationName', v)}
                placeholder="เช่น อาคาร 14 ชั้น 4 หรือ โรงยิม 2"
                placeholderTextColor={colors.outline}
                returnKeyType="next"
                onSubmitEditing={() => descriptionRef.current?.focus()}
                accessibilityLabel="สถานที่จัดงาน"
                testID="input-event-location"
              />
              {errors.locationName && (
                <View style={styles.errorRow} accessibilityRole="alert">
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{errors.locationName}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                รายละเอียดกิจกรรม <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                ref={descriptionRef}
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                value={form.description}
                onChangeText={(v) => updateField('description', v)}
                placeholder="รายละเอียดเกี่ยวกับกำหนดการ เงื่อนไข และสิ่งที่ต้องเตรียม"
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={4}
                returnKeyType="done"
                accessibilityLabel="รายละเอียดกิจกรรม"
                testID="input-event-description"
              />
              {errors.description && (
                <View style={styles.errorRow} accessibilityRole="alert">
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{errors.description}</Text>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.pressed,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="สร้างกิจกรรม"
              testID="create-event-submit-btn"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.onPrimary} testID="upload-spinner" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
                  <Text style={styles.submitBtnText}>สร้างและเผยแพร่กิจกรรม</Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Action Sheet */}
      <ImagePickerActionSheet
        visible={isActionSheetOpen}
        onTakePhoto={handleTakePhoto}
        onChooseLibrary={handleChooseLibrary}
        onClose={handleCloseActionSheet}
      />

      {/* In-app Camera View Modal */}
      {isCameraOpen && (
        <CameraViewModal
          visible={isCameraOpen}
          onCapture={handleCameraCapture}
          onClose={handleCameraClose}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.margin,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  requiredMark: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.DEFAULT,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.onSurface,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  uploadPlaceholder: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  uploadPlaceholderError: {
    borderColor: colors.error,
  },
  cameraIconCircle: {
    width: 48,
    height: 48,
    borderRadius: rounded.full,
    backgroundColor: '#DCF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  uploadSubtext: {
    fontSize: 11,
    color: colors.outline,
  },
  previewContainer: {
    borderRadius: rounded.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  previewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
  },
  previewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: rounded.DEFAULT,
    backgroundColor: colors.surfaceContainerLowest,
  },
  removeActionBtn: {
    backgroundColor: '#FFDAD6',
  },
  previewActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  categoryPillTextActive: {
    color: colors.onPrimary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: rounded.lg,
    paddingVertical: 14,
    minHeight: 48,
    marginTop: spacing.sm,
    ...elevation.card,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
