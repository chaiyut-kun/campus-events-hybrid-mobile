import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, elevation, rounded, spacing } from '../constants/theme';

export type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = 'ไม่พบกิจกรรม',
  description = 'ไม่มีกิจกรรมที่ตรงกับเงื่อนไขในขณะนี้ หรือยังไม่มีการบันทึกรายการโปรด',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container} testID="empty-state-container">
      <View style={styles.iconCircle}>
        <Ionicons name="calendar-outline" size={38} color={colors.outline} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction && (
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
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
    backgroundColor: colors.surfaceContainerLow,
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
  description: {
    fontSize: 14,
    color: colors.outline,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rounded.DEFAULT,
    ...elevation.card,
  },
  actionButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
