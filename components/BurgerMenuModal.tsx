import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { colors, elevation, rounded, spacing } from '../constants/theme';

export type BurgerMenuModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function BurgerMenuModal({ visible, onClose }: BurgerMenuModalProps) {
  const currentPath = usePathname();

  const menuItems = [
    {
      title: 'Home',
      path: '/',
      icon: 'home-outline' as const,
    },
    {
      title: 'Campus Events',
      path: '/events',
      icon: 'calendar-outline' as const,
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: 'person-outline' as const,
    },
  ];

  const handleNavigate = (path: string) => {
    onClose();
    if (currentPath !== path) {
      router.push(path as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Navigation</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Close navigation menu"
            >
              <Ionicons name="close" size={20} color={colors.onSurface} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Pressable
                key={item.path}
                onPress={() => handleNavigate(item.path)}
                style={({ pressed }) => [
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Navigate to ${item.title}`}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isActive ? colors.primary : colors.onSurface}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                  ]}
                >
                  {item.title}
                </Text>
                {isActive && (
                  <View style={styles.activeDot} />
                )}
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 68,
    paddingRight: spacing.margin,
  },
  menuContainer: {
    width: 220,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    padding: spacing.sm,
    ...elevation.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.outline,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rounded.full,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: rounded.DEFAULT,
  },
  menuItemActive: {
    backgroundColor: '#DCF2E8',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  menuItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
