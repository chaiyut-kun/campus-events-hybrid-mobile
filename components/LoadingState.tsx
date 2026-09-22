import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../constants/theme';

export type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = 'กำลังโหลดรายการกิจกรรม...',
}: LoadingStateProps) {
  return (
    <View
      style={styles.container}
      testID="loading-state-container"
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    gap: spacing.md,
  },
  message: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
  },
});
