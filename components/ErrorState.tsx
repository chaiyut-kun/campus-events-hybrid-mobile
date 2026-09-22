import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, elevation, rounded, spacing } from '../constants/theme';

export type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  message,
  onRetry,
  retryLabel = 'ลองใหม่อีกครั้ง',
}: ErrorStateProps) {
  return (
    <View
      style={styles.container}
      testID="error-state-container"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={38} color={colors.error} />
      </View>

      <Text style={styles.title}>เกิดข้อผิดพลาดในการโหลดข้อมูล</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          accessibilityHint="กดเพื่อโหลดข้อมูลใหม่อีกครั้ง"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="refresh-outline" size={18} color={colors.onPrimary} />
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: rounded.full,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    color: colors.outline,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    borderRadius: rounded.DEFAULT,
    ...elevation.card,
  },
  retryButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
