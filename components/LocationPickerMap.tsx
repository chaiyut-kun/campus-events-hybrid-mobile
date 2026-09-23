import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import {
  Coordinates,
  getCurrentCoordinates,
  reverseGeocodeLocation,
  CAMPUS_CENTER_COORDS,
} from '../services/location';

type Props = {
  coordinate: Coordinates;
  onCoordinateChange: (coords: Coordinates, suggestedName?: string) => void;
};

/**
 * Interactive Location Picker Map for event creation.
 * Users can tap "Use current location" or tap directly on the map to place a pin.
 */
export function LocationPickerMap({ coordinate, onCoordinateChange }: Props) {
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const coords = await getCurrentCoordinates();
      const suggestedName = await reverseGeocodeLocation(coords);
      onCoordinateChange(coords, suggestedName || undefined);
    } catch (e: any) {
      Alert.alert(
        'ไม่สามารถอ่านตำแหน่งได้',
        'แอปไม่ได้รับอนุญาตหรืออุปกรณ์ไม่สามารถระบุตำแหน่งได้ จึงใช้พิกัดใจกลางมหาวิทยาลัยเป็นค่าเริ่มต้น',
        [
          {
            text: 'ตกลง',
            onPress: () => onCoordinateChange(CAMPUS_CENTER_COORDS),
          },
        ],
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent?.coordinate;
    if (coords?.latitude && coords?.longitude) {
      onCoordinateChange({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  };

  return (
    <View style={styles.container} testID="location-picker-container">
      {/* Header bar with quick GPS trigger */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.headerTitle}>ปักหมุดสถานที่จัดงาน</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.gpsBtn, pressed && styles.pressed]}
          onPress={handleUseCurrentLocation}
          disabled={isLocating}
          accessibilityRole="button"
          accessibilityLabel="ใช้ตำแหน่งปัจจุบันของคุณ"
          testID="use-current-location-btn"
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="navigate" size={14} color={colors.primary} />
              <Text style={styles.gpsBtnText}>ใช้ตำแหน่งปัจจุบัน</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Map view */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          region={{
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          }}
          onPress={handleMapPress}
          testID="location-picker-map"
        >
          <Marker
            coordinate={coordinate}
            draggable
            onDragEnd={handleMapPress}
            title="สถานที่จัดงาน"
            testID="picker-marker"
          />
        </MapView>
      </View>

      {/* Coordinate status footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
        </Text>
        <Text style={styles.footerHint}>แตะบนแผนที่เพื่อปรับย้ายหมุด</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: rounded.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...elevation.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.surfaceContainerLow,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCF2E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: rounded.full,
  },
  gpsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  mapWrapper: {
    height: 150,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  footerHint: {
    fontSize: 11,
    color: colors.outline,
  },
  pressed: {
    opacity: 0.7,
  },
});
