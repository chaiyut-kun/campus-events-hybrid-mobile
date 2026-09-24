import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  Image,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { EventCard } from '../../components/EventCard';
import { BurgerMenuModal } from '../../components/BurgerMenuModal';
import { SearchBar } from '../../components/SearchBar';
import { EventRegistrationModal } from '../../components/EventRegistrationModal';
import { CreateEventModal } from '../../components/CreateEventModal';
import { EventVenueMap } from '../../components/EventVenueMap';
import { AllEventsMapView } from '../../components/AllEventsMapView';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { mockEvents } from '../../data/events';
import { router } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { useEvents } from '../../context/EventsContext';
import { CampusEvent, EventListState } from '../../types/event';
import { colors, elevation, rounded, spacing } from '../../constants/theme';

export default function EventsScreen() {
  const { width } = useWindowDimensions();
  const numColumns = width >= 720 ? 2 : 1;

  // Shared favorites from Context
  const { isFavorite, toggleFavorite, savedCount } = useFavorites();
  const { addEvent } = useEvents();

  const [listState, setListState] = useState<EventListState>({
    status: 'ready',
    events: mockEvents,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrationEventId, setRegistrationEventId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Derived: current events source
  const currentEvents =
    listState.status === 'ready' ? listState.events : mockEvents;

  // Derived: filtered events (favorites tab + search query)
  const filteredEvents = useMemo(() => {
    let result = currentEvents;

    // Filter by Favorites Tab
    if (filter === 'saved') {
      result = result.filter((evt) => isFavorite(evt.id));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (evt) =>
          evt.title.toLowerCase().includes(q) ||
          evt.location.name.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [currentEvents, filter, searchQuery, isFavorite]);

  const selectedEvent = currentEvents.find((evt) => evt.id === selectedEventId);
  const registrationEvent = currentEvents.find((evt) => evt.id === registrationEventId);

  const handleOpenEvent = (id: string) => {
    setSelectedEventId(id);
  };

  const handleCloseDetail = () => {
    setSelectedEventId(null);
  };

  const handleOpenRegistration = (id: string) => {
    setRegistrationEventId(id);
  };

  const handleCloseRegistration = () => {
    setRegistrationEventId(null);
  };

  const handleCreateEvent = (newEvent: CampusEvent) => {
    addEvent(newEvent);
    setListState((current) => {
      const prevEvents = current.status === 'ready' ? current.events : mockEvents;
      return { status: 'ready', events: [newEvent, ...prevEvents] };
    });
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network latency
    setTimeout(() => {
      setListState({ status: 'ready', events: mockEvents });
      setRefreshing(false);
    }, 600);
  }, []);

  const handleRetry = () => {
    setListState({ status: 'loading' });
    setTimeout(() => {
      setListState({ status: 'ready', events: mockEvents });
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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

          {/* View Mode Toggle (List / Map) */}
          <Pressable
            style={({ pressed }) => [styles.viewModeToggle, pressed && styles.pressed]}
            onPress={() => setViewMode((prev) => (prev === 'list' ? 'map' : 'list'))}
            accessibilityRole="button"
            accessibilityLabel={viewMode === 'list' ? 'สลับไปยังมุมมองแผนที่' : 'สลับไปยังมุมมองรายการ'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="view-mode-toggle"
          >
            <Ionicons
              name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
              size={20}
              color={colors.primary}
            />
          </Pressable>

          {/* Burger Menu Button (44x44 touch target) */}
          <Pressable
            onPress={() => setIsMenuOpen(true)}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="menu" size={26} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {viewMode === 'map' ? (
        <AllEventsMapView
          events={filteredEvents}
          onSelectEvent={handleOpenEvent}
        />
      ) : (
        <>
          {/* Search Bar */}
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          accessibilityRole="button"
          accessibilityLabel={`Show all events, total ${currentEvents.length}`}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All Events ({currentEvents.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, filter === 'saved' && styles.filterTabActive]}
          onPress={() => setFilter('saved')}
          accessibilityRole="button"
          accessibilityLabel={`Show saved events, total ${savedCount}`}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
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

      {/* Main Content Render by State */}
      {listState.status === 'loading' ? (
        <LoadingState message="กำลังโหลดรายการกิจกรรม..." />
      ) : listState.status === 'error' ? (
        <ErrorState message={listState.message} onRetry={handleRetry} />
      ) : (
        <FlatList
          key={`events-grid-${numColumns}`}
          data={filteredEvents}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          contentContainerStyle={[
            styles.listContent,
            filteredEvents.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              isFavorite={isFavorite(item.id)}
              onOpen={handleOpenEvent}
              onToggleFavorite={toggleFavorite}
              style={numColumns > 1 ? styles.gridCard : undefined}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={
                searchQuery.trim()
                  ? 'ไม่พบกิจกรรมที่ตรงกับคำค้น'
                  : filter === 'saved'
                    ? 'ยังไม่มีกิจกรรมที่บันทึกไว้'
                    : 'ไม่พบกิจกรรมในขณะนี้'
              }
              description={
                searchQuery.trim()
                  ? `ไม่มีกิจกรรมที่ตรงกับ "${searchQuery}" ลองเปลี่ยนคำค้นดู`
                  : filter === 'saved'
                    ? 'กดที่รูปดาวบนการ์ดกิจกรรมเพื่อบันทึกงานที่คุณสนใจลงในรายการโปรด'
                    : 'โปรดลองตรวจสอบการเชื่อมต่อ หรือกลับมาดูใหม่อีกครั้ง'
              }
              actionLabel={
                searchQuery.trim()
                  ? 'ล้างคำค้นหา'
                  : filter === 'saved'
                    ? 'ดูกิจกรรมทั้งหมด'
                    : 'รีเฟรชข้อมูล'
              }
              onAction={
                searchQuery.trim()
                  ? () => setSearchQuery('')
                  : filter === 'saved'
                    ? () => setFilter('all')
                    : handleRefresh
              }
            />
          }
        />
      )}
        </>
      )}

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
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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

                {/* Embedded Venue Map */}
                <EventVenueMap
                  venue={selectedEvent.location}
                  eventTitle={selectedEvent.title}
                />

                {/* Full Description */}
                <Text style={styles.modalSectionHeader}>About This Event</Text>
                <Text style={styles.modalDescription}>
                  {selectedEvent.description}
                </Text>

                {/* Favorite Action Button in Modal (minHeight: 44) */}
                <Pressable
                  style={({ pressed }) => [
                    styles.modalFavoriteBtn,
                    isFavorite(selectedEvent.id)
                      ? styles.modalFavoriteBtnActive
                      : styles.modalFavoriteBtnInactive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleFavorite(selectedEvent.id)}
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={
                      isFavorite(selectedEvent.id)
                        ? 'star'
                        : 'star-outline'
                    }
                    size={18}
                    color={
                      isFavorite(selectedEvent.id)
                        ? colors.primary
                        : colors.onSurface
                    }
                  />
                  <Text
                    style={[
                      styles.modalFavoriteBtnText,
                      isFavorite(selectedEvent.id) &&
                        styles.modalFavoriteBtnTextActive,
                    ]}
                  >
                    {isFavorite(selectedEvent.id)
                      ? 'บันทึกในรายการโปรดแล้ว'
                      : 'เพิ่มลงในรายการโปรด'}
                  </Text>
                </Pressable>

                {/* Registration Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.registerBtn,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleOpenRegistration(selectedEvent.id)}
                  accessibilityRole="button"
                  accessibilityLabel="ลงทะเบียนเข้าร่วมกิจกรรม"
                  testID="register-event-btn"
                >
                  <Ionicons name="create-outline" size={18} color={colors.onPrimary} />
                  <Text style={styles.registerBtnText}>
                    ลงทะเบียนเข้าร่วมกิจกรรม
                  </Text>
                </Pressable>

                {/* View Full Page & Reminders Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.fullDetailBtn,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    const id = selectedEvent.id;
                    handleCloseDetail();
                    router.push({ pathname: '/events/[id]', params: { id } });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="เปิดหน้าเต็มและตั้งเตือน"
                  testID="open-full-event-btn"
                >
                  <Ionicons name="notifications-outline" size={18} color={colors.primary} />
                  <Text style={styles.fullDetailBtnText}>
                    เปิดหน้าเต็ม & ตั้งการแจ้งเตือน
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Event Registration Modal */}
      {registrationEvent && (
        <EventRegistrationModal
          visible={Boolean(registrationEvent)}
          eventId={registrationEvent.id}
          eventTitle={registrationEvent.title}
          onClose={handleCloseRegistration}
        />
      )}

      {/* Floating Action Button (FAB) for Creating Event */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
        onPress={() => setIsCreateOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="สร้างกิจกรรมใหม่"
        testID="create-event-fab"
      >
        <Ionicons name="add" size={28} color={colors.onPrimary} />
      </Pressable>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateEvent}
      />

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
    width: 44,
    height: 44,
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
    minHeight: 36,
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
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  columnWrapper: {
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
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
    width: 36,
    height: 36,
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
    minHeight: 44,
    paddingVertical: 12,
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
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingVertical: 12,
    borderRadius: rounded.lg,
    backgroundColor: colors.primary,
    ...elevation.card,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  fullDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    borderRadius: rounded.DEFAULT,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLowest,
    minHeight: 44,
    marginTop: spacing.xs,
  },
  fullDetailBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: rounded.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.card,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  viewModeToggle: {
    width: 36,
    height: 36,
    borderRadius: rounded.full,
    backgroundColor: '#DCF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
