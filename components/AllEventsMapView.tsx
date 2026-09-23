import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors, rounded, spacing, elevation } from '../constants/theme';
import { CampusEvent } from '../types/event';
import { CAMPUS_CENTER_COORDS } from '../services/location';

type Props = {
  events: CampusEvent[];
  onSelectEvent: (eventId: string) => void;
};

/**
 * AllEventsMapView renders an interactive overview map with markers
 * for all active/filtered campus events.
 */
export function AllEventsMapView({ events, onSelectEvent }: Props) {
  return (
    <View style={styles.container} testID="all-events-map-view">
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: CAMPUS_CENTER_COORDS.latitude,
          longitude: CAMPUS_CENTER_COORDS.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        testID="all-events-map"
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  map: {
    ...StyleSheet.absoluteFill,
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
