import React from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing } from '../constants/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/**
 * Controlled search input with clear button.
 * No debounce — filters instantly on each keystroke (4 mock items, YAGNI).
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'ค้นหากิจกรรม...',
}: SearchBarProps) {
  return (
    <View style={styles.container} accessibilityRole="search">
      <Ionicons
        name="search"
        size={18}
        color={colors.outline}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="ค้นหากิจกรรม"
        testID="search-input"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel="ล้างคำค้นหา"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID="search-clear"
        >
          <Ionicons name="close-circle" size={18} color={colors.outline} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    marginHorizontal: spacing.margin,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.onSurface,
    paddingVertical: 10,
  },
  clearBtn: {
    marginLeft: spacing.sm,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
