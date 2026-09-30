import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { colors, rounded, spacing } from '../constants/theme';
import { CampusEvent } from '../types/event';
import { CAMPUS_CENTER_COORDS } from '../services/location';
import { OSM_CONFIG } from '../constants/map';

type Props = {
  events: CampusEvent[];
  onSelectEvent: (eventId: string) => void;
};

/**
 * AllEventsMapView renders an interactive overview map with markers
 * for all active/filtered campus events using OpenStreetMap tiles.
 */
export function AllEventsMapView({ events, onSelectEvent }: Props) {
  return (
    <View style={styles.container} testID="all-events-map-view">
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={{
          latitude: CAMPUS_CENTER_COORDS.latitude,
          longitude: CAMPUS_CENTER_COORDS.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        testID="all-events-map"
      >
        <UrlTile
          urlTemplate={OSM_CONFIG.tileUrl}
          maximumZ={OSM_CONFIG.maxZoom}
          flipY={false}
          zIndex={-1}
          testID="osm-url-tile"
        />
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            title={event.title}
            description={event.location.name}
            testID={`marker-${event.id}`}
          >
            <Callout
              onPress={() => onSelectEvent(event.id)}
              testID={`callout-${event.id}`}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.calloutLocation} numberOfLines={1}>
                  📍 {event.location.name}
                </Text>
                <Text style={styles.calloutHint}>แตะเพื่อดูรายละเอียด</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.osmAttribution} pointerEvents="none">
        <Text style={styles.osmAttributionText}>{OSM_CONFIG.attribution}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  osmAttribution: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: rounded.full,
  },
  osmAttributionText: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  calloutContainer: {
    padding: spacing.xs,
    minWidth: 160,
    maxWidth: 240,
    borderRadius: rounded.DEFAULT,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  calloutLocation: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  calloutHint: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
});

