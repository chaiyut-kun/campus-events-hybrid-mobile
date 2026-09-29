import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing } from '../constants/theme';

type Props = {
  updatedAt: string | null;
  onRetry?: () => void;
};

/**
 * Formats ISO timestamp to human-readable time string.
 */
function formatUpdatedAt(isoString: string | null): string {
  if (!isoString) return 'ไม่ระบุ';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'ไม่ระบุ';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} น.`;
  } catch {
    return 'ไม่ระบุ';
  }
}

/**
 * Offline banner displayed when the application is operating with cached data.
 * Informs the user that network connectivity is unavailable and shows when
 * the data was last synchronized.
 */
export function OfflineBanner({ updatedAt, onRetry }: Props) {
  const formattedTime = formatUpdatedAt(updatedAt);

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      testID="offline-banner"
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={18} color="#9A3412" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>โหมดออฟไลน์</Text>
          <Text style={styles.subtitle}>
            แสดงข้อมูลล่าสุดจากแคช ({formattedTime})
          </Text>
        </View>
      </View>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="ลองโหลดข้อมูลใหม่อีกครั้ง"
          testID="offline-retry-btn"
        >
          <Ionicons name="reload" size={14} color="#9A3412" />
          <Text style={styles.retryText}>ลองใหม่</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEDD5', // warm amber container
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.sm + 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A3412',
  },
  subtitle: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FED7AA',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: rounded.full,
    marginLeft: spacing.sm,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A3412',
  },
  pressed: {
    opacity: 0.6,
  },
});
