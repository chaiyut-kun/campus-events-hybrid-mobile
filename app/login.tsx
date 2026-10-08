import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail('student@campus.ac.th');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleFillOrganizerDemo = () => {
    setEmail('organizer@campus.ac.th');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('กรุณากรอกอีเมล/รหัสนักศึกษา และรหัสผ่าน');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await login(email.trim(), password);

      // On successful login, navigate back or to profile
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/profile');
      }
    } catch (err: any) {
      const msg = err?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      setErrorMessage(msg);
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Close login screen"
            testID="login-close-btn"
          >
            <Ionicons name="close" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>เข้าสู่ระบบ</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Welcome */}
          <View style={styles.brandContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={40} color={colors.primary} />
            </View>
            <Text style={styles.brandTitle}>Campus Events</Text>
            <Text style={styles.brandSubtitle}>
              เข้าสู่ระบบเพื่อลงทะเบียนและติดตามกิจกรรมที่คุณสนใจ
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner} testID="login-error-banner">
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Inputs */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>อีเมล หรือ รหัสนักศึกษา</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.outline}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="student@campus.ac.th หรือ 65070001"
                  placeholderTextColor={colors.outline}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  accessibilityLabel="อีเมลหรือรหัสนักศึกษา"
                  testID="login-email-input"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>รหัสผ่าน</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.outline}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="รหัสผ่านของคุณ"
                  placeholderTextColor={colors.outline}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  accessibilityLabel="รหัสผ่าน"
                  testID="login-password-input"
                />
              </View>
            </View>

            {/* Quick Demo Fill Buttons */}
            <View style={styles.demoButtonsRow}>
              <Pressable
                onPress={handleFillDemo}
                style={({ pressed }) => [styles.demoBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="กรอกบัญชีนักศึกษาทดสอบ"
                testID="demo-account-btn"
              >
                <Ionicons name="school-outline" size={15} color={colors.primary} />
                <Text style={styles.demoBtnText}>⚡ นศ. (Student)</Text>
              </Pressable>

              <Pressable
                onPress={handleFillOrganizerDemo}
                style={({ pressed }) => [
                  styles.demoBtn,
                  styles.demoOrganizerBtn,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="กรอกบัญชีผู้จัดงานทดสอบ"
                testID="demo-organizer-btn"
              >
                <Ionicons name="business-outline" size={15} color="#B8860B" />
                <Text style={[styles.demoBtnText, styles.demoOrganizerBtnText]}>
                  🏢 ผู้จัด (Organizer)
                </Text>
              </Pressable>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.submitBtn,
                isLoading && styles.submitBtnDisabled,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="เข้าสู่ระบบ"
              testID="login-submit-btn"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>เข้าสู่ระบบ</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: rounded.full,
    backgroundColor: '#DCF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.errorContainer,
    padding: spacing.sm,
    borderRadius: rounded.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.xl,
    padding: spacing.lg,
    ...elevation.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: rounded.md,
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.onSurface,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#EAF6EF',
    borderRadius: rounded.md,
    borderWidth: 1,
    borderColor: '#C3E8D3',
  },
  demoOrganizerBtn: {
    backgroundColor: '#FEF9E7',
    borderColor: '#F9E79F',
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  demoOrganizerBtnText: {
    color: '#B7950B',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: rounded.md,
    marginTop: spacing.xs,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
