import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeafletMapView } from './LeafletMapView';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { CampusLocation } from '../types/event';
import { openExternalDirections } from '../services/location';

type Props = {
  venue: CampusLocation;
  eventTitle: string;
};

/**
 * Embedded Venue Map for Event Detail Modal.
 * Renders an inline Leaflet.js OpenStreetMap (~180dp) with venue pin and navigation trigger.
 * Fully compatible with Android Expo Go (no Google Maps API key required).
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
        <LeafletMapView
          center={{
            latitude: venue.latitude,
            longitude: venue.longitude,
          }}
          zoom={16}
          markers={[
            {
              id: 'venue',
              latitude: venue.latitude,
              longitude: venue.longitude,
              title: eventTitle,
              description: venue.name,
              testID: 'venue-marker',
            },
          ]}
          style={styles.map}
          testID="event-venue-map"
        />
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
    position: 'relative',
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
