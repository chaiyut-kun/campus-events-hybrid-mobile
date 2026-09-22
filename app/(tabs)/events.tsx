import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { EventCard } from '../../components/EventCard';
import { BurgerMenuModal } from '../../components/BurgerMenuModal';
import { mockEvents, toggleFavoriteId } from '../../data/events';
import { colors, elevation, rounded, spacing } from '../../constants/theme';

export default function EventsScreen() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'saved'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derived values
  const savedCount = favoriteIds.length;
  const filteredEvents =
    filter === 'saved'
      ? mockEvents.filter((evt) => favoriteIds.includes(evt.id))
      : mockEvents;

  const selectedEvent = mockEvents.find((evt) => evt.id === selectedEventId);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((current) => toggleFavoriteId(current, id));
  };

  const handleOpenEvent = (id: string) => {
    setSelectedEventId(id);
  };

  const handleCloseDetail = () => {
    setSelectedEventId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIconWrapper}>
            <Ionicons name="sparkles" size={18} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Campus Events</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Saved Count Badge */}
          <View style={styles.savedBadge} testID="saved-counter-badge">
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={styles.savedBadgeText}>{savedCount}</Text>
          </View>

          {/* Burger Menu Button */}
          <Pressable
            onPress={() => setIsMenuOpen(true)}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
          >
            <Ionicons name="menu" size={26} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          accessibilityRole="button"
          accessibilityLabel={`Show all events, total ${mockEvents.length}`}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All Events ({mockEvents.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, filter === 'saved' && styles.filterTabActive]}
          onPress={() => setFilter('saved')}
          accessibilityRole="button"
          accessibilityLabel={`Show saved events, total ${savedCount}`}
        >
          <Ionicons
            name={filter === 'saved' ? 'star' : 'star-outline'}
            size={14}
            color={filter === 'saved' ? colors.onPrimary : colors.outline}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === 'saved' && styles.filterTabTextActive,
            ]}
          >
            Saved ({savedCount})
          </Text>
        </Pressable>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavorite={favoriteIds.includes(item.id)}
            onOpen={handleOpenEvent}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bookmark-outline" size={36} color={colors.outline} />
            </View>
            <Text style={styles.emptyStateTitle}>ยังไม่มีกิจกรรมที่บันทึกไว้</Text>
            <Text style={styles.emptyStateSubtitle}>
              กดที่รูปดาวบนการ์ดกิจกรรมเพื่อบันทึกงานที่คุณสนใจลงในรายการโปรด
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.browseAllButton,
                pressed && styles.pressed,
              ]}
              onPress={() => setFilter('all')}
              accessibilityRole="button"
            >
              <Text style={styles.browseAllButtonText}>ดูกิจกรรมทั้งหมด</Text>
            </Pressable>
          </View>
        }
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal
          visible={Boolean(selectedEvent)}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseDetail}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryBadgeText}>
                  {selectedEvent.category}
                </Text>
              </View>
              <Pressable
                onPress={handleCloseDetail}
                style={({ pressed }) => [styles.closeModalBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Close detail modal"
              >
                <Ionicons name="close" size={22} color={colors.onSurface} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Event Image */}
              {selectedEvent.imageUrl ? (
                <Image
                  source={{ uri: selectedEvent.imageUrl }}
                  style={styles.modalImage}
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Ionicons name="calendar-outline" size={48} color={colors.secondary} />
                  <Text style={styles.modalPlaceholderCategory}>
                    {selectedEvent.category}
                  </Text>
                </View>
              )}

              {/* Title & Metadata */}
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

                <View style={styles.modalMetaCard}>
                  <View style={styles.modalMetaRow}>
                    <Ionicons name="time" size={18} color={colors.primary} />
                    <View style={styles.modalMetaTextCol}>
                      <Text style={styles.modalMetaLabel}>Date & Time</Text>
                      <Text style={styles.modalMetaValue}>
                        {new Date(selectedEvent.startsAt).toLocaleString('en-US', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDivider} />

                  <View style={styles.modalMetaRow}>
                    <Ionicons name="location" size={18} color={colors.tertiary} />
                    <View style={styles.modalMetaTextCol}>
                      <Text style={styles.modalMetaLabel}>Location</Text>
                      <Text style={styles.modalMetaValue}>
                        {selectedEvent.location.name}
                      </Text>
                      <Text style={styles.modalCoordsText}>
                        Lat: {selectedEvent.location.latitude}, Long:{' '}
                        {selectedEvent.location.longitude}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Full Description */}
                <Text style={styles.modalSectionHeader}>About This Event</Text>
                <Text style={styles.modalDescription}>
                  {selectedEvent.description}
                </Text>

                {/* Favorite Action Button in Modal */}
                <Pressable
                  style={({ pressed }) => [
                    styles.modalFavoriteBtn,
                    favoriteIds.includes(selectedEvent.id)
                      ? styles.modalFavoriteBtnActive
                      : styles.modalFavoriteBtnInactive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleToggleFavorite(selectedEvent.id)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={
                      favoriteIds.includes(selectedEvent.id)
                        ? 'star'
                        : 'star-outline'
                    }
                    size={18}
                    color={
                      favoriteIds.includes(selectedEvent.id)
                        ? colors.primary
                        : colors.onSurface
                    }
                  />
                  <Text
                    style={[
                      styles.modalFavoriteBtnText,
                      favoriteIds.includes(selectedEvent.id) &&
                        styles.modalFavoriteBtnTextActive,
                    ]}
                  >
                    {favoriteIds.includes(selectedEvent.id)
                      ? 'บันทึกในรายการโปรดแล้ว'
                      : 'เพิ่มลงในรายการโปรด'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Floating Burger Navigation Modal */}
      <BurgerMenuModal
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: rounded.DEFAULT,
    backgroundColor: '#DCF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCF2E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  savedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  filterTabTextActive: {
    color: colors.onPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyStateContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: colors.outline,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  browseAllButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: rounded.DEFAULT,
  },
  browseAllButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  modalCategoryBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  modalCategoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingBottom: spacing.xl,
  },
  modalImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  modalImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  modalPlaceholderCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  modalBody: {
    padding: spacing.margin,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 26,
  },
  modalMetaCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...elevation.card,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  modalMetaTextCol: {
    flex: 1,
    gap: 2,
  },
  modalMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.outline,
    textTransform: 'uppercase',
  },
  modalMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  modalCoordsText: {
    fontSize: 12,
    color: colors.outline,
    marginTop: 2,
  },
  modalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
  },
  modalSectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  modalFavoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: rounded.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  modalFavoriteBtnActive: {
    backgroundColor: '#DCF2E8',
    borderColor: colors.primary,
  },
  modalFavoriteBtnInactive: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
  },
  modalFavoriteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  modalFavoriteBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
