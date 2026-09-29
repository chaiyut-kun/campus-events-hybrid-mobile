import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import { colors, rounded, spacing, elevation } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container} testID="not-found-screen">
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="warning-outline" size={56} color={colors.error || '#BA1A1A'} />
        </View>

        <Text style={styles.title} testID="not-found-title">
          ไม่พบหน้าที่ต้องการ
        </Text>

        <Text style={styles.description}>
          ขออภัย เส้นทางหรือหน้าที่คุณกำลังเข้าถึงไม่มีอยู่ในระบบ
        </Text>

        <Pressable
          style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
          onPress={() => router.replace('/events')}
          accessibilityRole="button"
          accessibilityLabel="กลับสู่หน้ารายการกิจกรรม"
          testID="not-found-back-home-btn"
        >
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
          <Text style={styles.homeButtonText}>กลับสู่หน้ารายการกิจกรรม</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: 340,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: rounded.full,
    backgroundColor: '#FFDAD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: rounded.full,
    minHeight: 48,
    marginTop: spacing.md,
    ...elevation.card,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.7,
  },
});
