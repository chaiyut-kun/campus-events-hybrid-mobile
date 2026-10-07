import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { CampusLocation } from '../types/event';
import { openExternalDirections } from '../services/location';
import { OSM_CONFIG } from '../constants/map';

type Props = {
  venue: CampusLocation;
  eventTitle: string;
};

/**
 * Embedded Venue Map for Event Detail Modal.
 * Renders an inline OpenStreetMap MapView (~200dp) with venue pin and navigation trigger.
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
          mapType="none"
          initialRegion={{
            latitude: venue.latitude,
            longitude: venue.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          testID="event-venue-map"
        >
          <UrlTile
            urlTemplate={OSM_CONFIG.tileUrl}
            maximumZ={OSM_CONFIG.maxZoom}
            flipY={false}
            shouldReplaceMapContent={true}
            testID="osm-url-tile"
          />
          <Marker
            coordinate={{
              latitude: venue.latitude,
              longitude: venue.longitude,
            }}
            title={eventTitle}
            description={venue.name}
            zIndex={10}
            testID="venue-marker"
          />
        </MapView>
        <View style={styles.osmAttribution} pointerEvents="none">
          <Text style={styles.osmAttributionText}>{OSM_CONFIG.attribution}</Text>
        </View>
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
  osmAttribution: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: rounded.full,
  },
  osmAttributionText: {
    fontSize: 9,
    color: colors.onSurfaceVariant,
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

