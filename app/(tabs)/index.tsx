import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, elevation, rounded, spacing } from '../../constants/theme';

export default function HomeScreen() {
  const handleOpenProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        {/* Brand Logo & Name */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>{'<>'}</Text>
          </View>
          <Text style={styles.brandTitle}>DevFolio</Text>
        </View>

        {/* Right Actions: Avatar & Burger Menu */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={handleOpenProfile}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Profile by Avatar"
          >
            <Image
              source={require('../../assets/lab1/me.jpeg')}
              style={styles.avatarImage}
            />
          </Pressable>

          <Pressable
            onPress={handleOpenProfile}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Profile by Menu"
          >
            <Ionicons name="menu" size={26} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* Body intentionally blank per instruction and Figma design */}
      <View style={styles.body} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
    ...elevation.card,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: rounded.DEFAULT,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.onPrimary,
    fontWeight: '800',
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: rounded.full,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
