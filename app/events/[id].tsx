import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { EventVenueMap } from '../../components/EventVenueMap';
import { colors, rounded, spacing, elevation } from '../../constants/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEventById, deleteEvent, scheduleReminder, cancelReminder, isReminded } =
    useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);

  const event = id ? getEventById(id) : undefined;

  // ── Event Not Found Fallback ──────────────────────────────────────────
  if (!event) {
    return (
      <SafeAreaView style={styles.notFoundContainer} testID="event-not-found-screen">
        <View style={styles.notFoundCard}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colors.error || '#BA1A1A'}
          />
          <Text style={styles.notFoundTitle} testID="event-not-found-title">
            ไม่พบกิจกรรม
          </Text>
          <Text style={styles.notFoundDesc}>
            กิจกรรมนี้อาจถูกลบไปแล้ว หรือรหัสกิจกรรมไม่ถูกต้องในระบบ
          </Text>
          <Pressable
            style={({ pressed }) => [styles.returnBtn, pressed && styles.pressed]}
            onPress={() => router.replace('/events')}
            accessibilityRole="button"
            accessibilityLabel="กลับสู่หน้ารายการกิจกรรม"
            testID="return-to-events-btn"
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.returnBtnText}>กลับสู่หน้ารายการกิจกรรม</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(event.id);
  const reminded = isReminded(event.id);

  const formattedDate = new Date(event.startsAt).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // ── Reminder Handlers ───────────────────────────────────────────────
  const handleSchedule = async (seconds?: number) => {
    try {
      setIsProcessing(true);
      await scheduleReminder(event, seconds);
      Alert.alert(
        'ตั้งเตือนสำเร็จ',
        seconds
          ? `ระบบจะส่งการแจ้งเตือนทดสอบในอีก ${seconds} วินาที (สามารถสลับแอปหรือปิดแอปได้)`
          : `ระบบจะเตือนล่วงหน้า 30 นาทีก่อนเริ่มกิจกรรม (${event.title})`,
      );
    } catch (err: any) {
      if (err.message === 'notification-permission-denied') {
        Alert.alert(
          'ไม่ได้รับอนุญาต',
          'กรุณาเปิดสิทธิ์การแจ้งเตือนในการตั้งค่าของอุปกรณ์ เพื่อรับการเตือนกิจกรรม',
        );
      } else if (err.message === 'reminder-time-has-passed') {
        Alert.alert(
          'ไม่สามารถตั้งเตือนได้',
          'เวลาเตือนล่วงหน้า 30 นาทีได้ผ่านไปแล้ว หรือกิจกรรมได้เริ่มต้นขึ้นแล้ว',
        );
      } else {
        Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถตั้งการแจ้งเตือนได้ กรุณาลองใหม่');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelReminder = async () => {
    try {
      setIsProcessing(true);
      await cancelReminder(event.id);
      Alert.alert('ยกเลิกการเตือนแล้ว', 'ยกเลิกการแจ้งเตือนสำหรับกิจกรรมนี้เรียบร้อยแล้ว');
    } catch (e) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถยกเลิกการแจ้งเตือนได้');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Delete Event Handler ─────────────────────────────────────────────
  const handleDeleteEvent = () => {
    Alert.alert(
      'ยืนยันการลบกิจกรรม',
      `คุณต้องการลบกิจกรรม "${event.title}" ใช่หรือไม่? หากมีการตั้งเตือนไว้ ระบบจะยกเลิกการเตือนโดยอัตโนมัติ`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบกิจกรรม',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await deleteEvent(event.id);
              router.replace('/events');
            } catch (err) {
              Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถลบกิจกรรมได้');
              setIsProcessing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']} testID="event-detail-screen">
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
          onPress={() => router.replace('/events')}
          accessibilityRole="button"
          accessibilityLabel="กลับหน้ารายการกิจกรรม"
          testID="detail-back-btn"
        >
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          รายละเอียดกิจกรรม
        </Text>

        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
          onPress={() => toggleFavorite(event.id)}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
          testID="detail-favorite-btn"
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? colors.error || '#BA1A1A' : colors.onSurfaceVariant}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Image */}
        <View style={styles.imageWrapper}>
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={event.title}
            />
          ) : (
            <View style={styles.placeholderBanner}>
              <Ionicons name="images-outline" size={48} color={colors.outline} />
              <Text style={styles.placeholderText}>Campus Events</Text>
            </View>
          )}
        </View>

        {/* Info Header */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        <Text style={styles.title} testID="event-detail-title">
          {event.title}
        </Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>

        {/* Venue Information & Inline Map (Lab 10 Integration) */}
        <View style={styles.venueSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.venueName}>{event.location.name}</Text>
          </View>
          <EventVenueMap venue={event.location} eventTitle={event.title} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>เกี่ยวกับกิจกรรม</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Reminder Actions (Lab 11 Core Feature) */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Ionicons
              name={reminded ? 'notifications' : 'notifications-outline'}
              size={24}
              color={reminded ? colors.primary : colors.onSurfaceVariant}
            />
            <View style={styles.reminderHeaderInfo}>
              <Text style={styles.reminderCardTitle}>การแจ้งเตือนกิจกรรม</Text>
              <Text style={styles.reminderCardSubtitle}>
                {reminded
                  ? 'ระบบกำลังติดตามและจะแจ้งเตือนเมื่อใกล้ถึงเวลา'
                  : 'ตั้งเตือนล่วงหน้าเพื่อไม่พลาดกิจกรรมสำคัญ'}
              </Text>
            </View>
          </View>

          {reminded ? (
            <Pressable
              style={({ pressed }) => [
                styles.cancelReminderBtn,
                pressed && styles.pressed,
                isProcessing && styles.disabled,
              ]}
              onPress={handleCancelReminder}
              disabled={isProcessing}
              accessibilityRole="button"
              accessibilityLabel="ยกเลิกการแจ้งเตือนกิจกรรมนี้"
              testID="cancel-reminder-btn"
            >
              <Ionicons name="notifications-off-outline" size={18} color="#BA1A1A" />
              <Text style={styles.cancelReminderBtnText}>ยกเลิกการเตือน</Text>
            </Pressable>
          ) : (
            <View style={styles.scheduleBtnRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.scheduleBtn,
                  pressed && styles.pressed,
                  isProcessing && styles.disabled,
                ]}
                onPress={() => handleSchedule()}
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel="เตือนก่อนกิจกรรม 30 นาที"
                testID="schedule-reminder-btn"
              >
                <Ionicons name="alarm-outline" size={18} color="#FFFFFF" />
                <Text style={styles.scheduleBtnText}>เตือนก่อน 30 นาที</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.testReminderBtn,
                  pressed && styles.pressed,
                  isProcessing && styles.disabled,
                ]}
                onPress={() => handleSchedule(5)}
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel="ทดสอบเตือนใน 5 วินาที"
                testID="test-reminder-5s-btn"
              >
                <Ionicons name="timer-outline" size={18} color={colors.primary} />
                <Text style={styles.testReminderBtnText}>ทดสอบ 5 วิ</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Delete Event Button */}
        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && styles.pressed,
            isProcessing && styles.disabled,
          ]}
          onPress={handleDeleteEvent}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="ลบกิจกรรมนี้ออกจากระบบ"
          testID="delete-event-btn"
        >
          <Ionicons name="trash-outline" size={18} color="#BA1A1A" />
          <Text style={styles.deleteBtnText}>ลบกิจกรรมนี้</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: rounded.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderBanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  placeholderText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  metaRow: {
    flexDirection: 'row',
  },
  categoryBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.onSurface,
    lineHeight: 28,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  venueSection: {
    gap: spacing.xs,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  description: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  reminderCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...elevation.card,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reminderHeaderInfo: {
    flex: 1,
  },
  reminderCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
  },
  reminderCardSubtitle: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  scheduleBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scheduleBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: rounded.DEFAULT,
    minHeight: 44,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  testReminderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: rounded.DEFAULT,
    minHeight: 44,
  },
  testReminderBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  cancelReminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFDAD6',
    paddingVertical: 12,
    borderRadius: rounded.DEFAULT,
    minHeight: 44,
  },
  cancelReminderBtnText: {
    color: '#BA1A1A',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    borderRadius: rounded.DEFAULT,
    borderWidth: 1,
    borderColor: '#FFDAD6',
    minHeight: 44,
    marginTop: spacing.sm,
  },
  deleteBtnText: {
    color: '#BA1A1A',
    fontWeight: '600',
    fontSize: 14,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notFoundCard: {
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: 320,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.onSurface,
  },
  notFoundDesc: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: rounded.full,
    minHeight: 44,
    marginTop: spacing.sm,
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
