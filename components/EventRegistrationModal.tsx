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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { RegistrationForm, RegistrationErrors } from '../types/registration';
import { validateRegistration } from '../utils/validateRegistration';
import { studentProfile } from '../data/profile';

type Props = {
  visible: boolean;
  eventId: string;
  eventTitle: string;
  onClose: () => void;
};

type SubmitStatus = 'idle' | 'submitting' | 'success';

/**
 * Controlled registration form modal with:
 * - Pre-filled profile data (fullName, studentId, faculty)
 * - Per-field validation errors near each input
 * - KeyboardAvoidingView + focus flow (returnKeyType="next")
 * - Double-submit lockout via isSubmitting
 * - In-modal success confirmation state
 */
export function EventRegistrationModal({ visible, eventId, eventTitle, onClose }: Props) {
  // Pre-fill from profile data
  const initialForm: RegistrationForm = {
    fullName: studentProfile.name,
    email: '',
    studentId: studentProfile.studentId,
    faculty: studentProfile.branch,
    notes: '',
  };

  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const formRef = useRef<RegistrationForm>(form);
  formRef.current = form;

  // Refs for focus flow
  const emailRef = useRef<TextInput>(null);
  const studentIdRef = useRef<TextInput>(null);
  const facultyRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const updateField = useCallback(
    (field: keyof RegistrationForm, value: string) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        formRef.current = next;
        return next;
      });
      // Clear error on this field when user types
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(async () => {
    const currentForm = formRef.current;
    const validationErrors = validateRegistration(currentForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Form preserves values on validation failure
    }

    setSubmitStatus('submitting');
    // Simulate API call (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitStatus('success');
  }, []);

  const handleClose = useCallback(() => {
    // Reset form state on close
    setForm(initialForm);
    setErrors({});
    setSubmitStatus('idle');
    onClose();
  }, [onClose]);

  // ── Success state ──────────────────────────────────────────────────
  if (submitStatus === 'success') {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={48} color={colors.onPrimary} />
          </View>
          <Text style={styles.successTitle}>ลงทะเบียนสำเร็จ!</Text>
          <Text style={styles.successSubtitle}>{eventTitle}</Text>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [styles.successCloseBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="ปิด"
            testID="success-close-btn"
          >
            <Text style={styles.successCloseBtnText}>ปิด</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  // ── Registration form ──────────────────────────────────────────────
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
            <Text style={styles.headerTitle}>ลงทะเบียนเข้าร่วมกิจกรรม</Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="ปิดฟอร์มลงทะเบียน"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="registration-close-btn"
            >
              <Ionicons name="close" size={22} color={colors.onSurface} />
            </Pressable>
          </View>

          {/* Event title badge */}
          <View style={styles.eventBadge}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.eventBadgeText} numberOfLines={1}>
              {eventTitle}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Full Name */}
            <FormField
              label="ชื่อ-นามสกุล"
              error={errors.fullName}
              required
            >
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                value={form.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                placeholder="กรอกชื่อ-นามสกุล"
                placeholderTextColor={colors.outline}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                autoCapitalize="words"
                accessibilityLabel="ชื่อ-นามสกุล"
                testID="input-fullName"
              />
            </FormField>

            {/* Email */}
            <FormField label="อีเมล" error={errors.email} required>
              <TextInput
                ref={emailRef}
                style={[styles.input, errors.email && styles.inputError]}
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                placeholder="example@university.ac.th"
                placeholderTextColor={colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => studentIdRef.current?.focus()}
                accessibilityLabel="อีเมล"
                testID="input-email"
              />
            </FormField>

            {/* Student ID */}
            <FormField
              label="รหัสนักศึกษา"
              error={errors.studentId}
              required
            >
              <TextInput
                ref={studentIdRef}
                style={[styles.input, errors.studentId && styles.inputError]}
                value={form.studentId}
                onChangeText={(v) => updateField('studentId', v)}
                placeholder="เช่น 2024-CIS-8492"
                placeholderTextColor={colors.outline}
                returnKeyType="next"
                onSubmitEditing={() => facultyRef.current?.focus()}
                accessibilityLabel="รหัสนักศึกษา"
                testID="input-studentId"
              />
            </FormField>

            {/* Faculty */}
            <FormField label="คณะ" error={errors.faculty} required>
              <TextInput
                ref={facultyRef}
                style={[styles.input, errors.faculty && styles.inputError]}
                value={form.faculty}
                onChangeText={(v) => updateField('faculty', v)}
                placeholder="เช่น Computer and Information Science"
                placeholderTextColor={colors.outline}
                returnKeyType="next"
                onSubmitEditing={() => notesRef.current?.focus()}
                accessibilityLabel="คณะ"
                testID="input-faculty"
              />
            </FormField>

            {/* Notes (optional) */}
            <FormField label="หมายเหตุเพิ่มเติม">
              <TextInput
                ref={notesRef}
                style={[styles.input, styles.textArea]}
                value={form.notes}
                onChangeText={(v) => updateField('notes', v)}
                placeholder="ข้อมูลเพิ่มเติมที่ต้องการแจ้ง (ไม่บังคับ)"
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                accessibilityLabel="หมายเหตุเพิ่มเติม"
                testID="input-notes"
              />
            </FormField>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitStatus === 'submitting'}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.pressed,
                submitStatus === 'submitting' && styles.submitBtnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="ยืนยันการลงทะเบียน"
              testID="submit-btn"
            >
              {submitStatus === 'submitting' ? (
                <ActivityIndicator
                  size="small"
                  color={colors.onPrimary}
                  testID="submit-spinner"
                />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
                  <Text style={styles.submitBtnText}>ยืนยันการลงทะเบียน</Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Form Field wrapper ─────────────────────────────────────────────

type FormFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Text>
      {children}
      {error && (
        <View
          style={styles.errorRow}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

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
    fontSize: 17,
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
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  eventBadgeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
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
    minHeight: 80,
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
  // Success state
  successContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.margin,
    gap: spacing.md,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: rounded.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  successCloseBtn: {
    backgroundColor: colors.primary,
    borderRadius: rounded.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    minHeight: 48,
    marginTop: spacing.lg,
  },
  successCloseBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
