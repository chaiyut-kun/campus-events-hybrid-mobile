import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { useEvents } from '../../context/EventsContext';
import { EventCard } from '../../components/EventCard';
import { EmptyState } from '../../components/EmptyState';
import { colors, elevation, rounded, spacing } from '../../constants/theme';

export default function FavoritesScreen() {
  const { favorites, isFavorite, toggleFavorite, savedCount } = useFavorites();
  const { events } = useEvents();

  // Filter events matching the saved favorite IDs
  const favoriteEvents = events.filter((evt) => favorites.includes(evt.id));

  const handleOpenEvent = (id: string) => {
    router.push({ pathname: '/events/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIconWrapper}>
            <Ionicons name="heart" size={18} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>รายการโปรด</Text>
        </View>

        {/* Saved Count Badge */}
        <View style={styles.savedBadge} testID="favorites-count-badge">
          <Ionicons name="star" size={14} color={colors.primary} />
          <Text style={styles.savedBadgeText}>{savedCount}</Text>
        </View>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          favoriteEvents.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavorite={isFavorite(item.id)}
            onOpen={handleOpenEvent}
            onToggleFavorite={toggleFavorite}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="ยังไม่มีกิจกรรมที่บันทึกไว้"
            description="กดที่รูปดาวบนการ์ดกิจกรรมเพื่อบันทึกงานที่คุณสนใจลงในรายการโปรด"
            actionLabel="ดูกิจกรรมทั้งหมด"
            onAction={() => router.push('/events')}
          />
        }
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
  listContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
