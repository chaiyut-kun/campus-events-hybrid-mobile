import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { CampusLocation } from '../types/event';
import { openExternalDirections } from '../services/location';

type Props = {
  venue: CampusLocation;
  eventTitle: string;
};

/**
 * Embedded Venue Map for Event Detail Modal.
 * Renders an inline MapView (~200dp) with venue pin and navigation trigger.
 * Works even when user denies location permission.
 */
export function EventVenueMap({ venue, eventTitle }: Props) {
  const handleDirections = () => {
    openExternalDirections(
      { latitude: venue.latitude, longitude: venue.longitude },
      venue.name || eventTitle,
    );
  };

  return (
    <View style={styles.container} testID="event-venue-map-container">
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: venue.latitude,
            longitude: venue.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          testID="event-venue-map"
        >
          <Marker
            coordinate={{
              latitude: venue.latitude,
              longitude: venue.longitude,
            }}
            title={eventTitle}
            description={venue.name}
            testID="venue-marker"
          />
        </MapView>
      </View>

      {/* Navigation directions action */}
      <Pressable
        style={({ pressed }) => [styles.directionsBtn, pressed && styles.pressed]}
        onPress={handleDirections}
        accessibilityRole="button"
        accessibilityLabel="เปิดแผนที่นำทางไปยังสถานที่จัดงาน"
        testID="open-directions-btn"
      >
        <Ionicons name="navigate-circle" size={20} color={colors.primary} />
        <Text style={styles.directionsBtnText}>เปิดแผนที่นำทาง</Text>
      </Pressable>
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
    marginTop: spacing.xs,
    ...elevation.card,
  },
  mapWrapper: {
    height: 180,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
    minHeight: 44,
  },
  directionsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
