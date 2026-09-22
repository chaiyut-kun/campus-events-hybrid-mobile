import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CampusEvent } from '../types/event';
import { colors, elevation, rounded, spacing } from '../constants/theme';

export type EventCardProps = {
  event: CampusEvent;
  isFavorite: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

export function EventCard({
  event,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: EventCardProps) {
  const [imageError, setImageError] = useState(false);

  // Format date helper
  const formattedDate = new Date(event.startsAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const shouldShowImage = Boolean(event.imageUrl) && !imageError;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onOpen(event.id)}
      accessibilityRole="button"
      accessibilityLabel={`เปิดรายละเอียดกิจกรรม ${event.title}`}
    >
      {/* Event Image or Fallback Placeholder */}
      <View style={styles.imageContainer}>
        {shouldShowImage ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
            accessibilityLabel={`ภาพกิจกรรม ${event.title}`}
          />
        ) : (
          <View style={styles.imagePlaceholder} testID="event-card-placeholder">
            <View style={styles.placeholderIconWrapper}>
              <Ionicons name="calendar-outline" size={36} color={colors.secondary} />
            </View>
            <Text style={styles.placeholderText}>{event.category}</Text>
          </View>
        )}

        {/* Category Pill Tag */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{event.category}</Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metadataRow}>
          <Ionicons name="time-outline" size={14} color={colors.outline} />
          <Text style={styles.metadataText}>{formattedDate}</Text>
        </View>

        <View style={styles.metadataRow}>
          <Ionicons name="location-outline" size={14} color={colors.outline} />
          <Text style={styles.metadataText} numberOfLines={1}>
            {event.location.name}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        {/* Footer Actions */}
        <View style={styles.cardFooter}>
          <Pressable
            style={({ pressed }) => [
              styles.favoriteButton,
              isFavorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive,
              pressed && styles.buttonPressed,
            ]}
            onPress={(e) => {
              // Prevent opening card details when tapping favorite
              e.stopPropagation?.();
              onToggleFavorite(event.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? `นำ ${event.title} ออกจากรายการโปรด`
                : `เพิ่ม ${event.title} ในรายการโปรด`
            }
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={16}
              color={isFavorite ? colors.primary : colors.outline}
            />
            <Text
              style={[
                styles.favoriteButtonText,
                isFavorite && styles.favoriteButtonTextActive,
              ]}
            >
              {isFavorite ? 'บันทึกแล้ว' : 'บันทึก'}
            </Text>
          </Pressable>

          <View style={styles.detailsIndicator}>
            <Text style={styles.detailsText}>รายละเอียด</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.outline} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...elevation.card,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surfaceContainerLow,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  placeholderIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(27, 27, 30, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  categoryBadgeText: {
    color: colors.onPrimary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  body: {
    padding: spacing.md,
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 22,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: colors.outline,
    lineHeight: 18,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: rounded.full,
    borderWidth: 1,
  },
  favoriteButtonActive: {
    backgroundColor: '#DCF2E8',
    borderColor: colors.primary,
  },
  favoriteButtonInactive: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.outlineVariant,
  },
  favoriteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  favoriteButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  detailsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsText: {
    fontSize: 12,
    color: colors.outline,
    fontWeight: '500',
  },
});
