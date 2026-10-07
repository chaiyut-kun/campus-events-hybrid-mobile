import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LeafletMapView } from './LeafletMapView';
import { colors } from '../constants/theme';
import { CampusEvent } from '../types/event';
import { CAMPUS_CENTER_COORDS } from '../services/location';

type Props = {
  events: CampusEvent[];
  onSelectEvent: (eventId: string) => void;
};

/**
 * AllEventsMapView renders an interactive overview map with markers
 * for all active/filtered campus events using Leaflet.js OpenStreetMap.
 * Bypasses Google Maps SDK on Android Expo Go to prevent black screen issue.
 */
export function AllEventsMapView({ events, onSelectEvent }: Props) {
  const markers = events.map((event) => ({
    id: event.id,
    latitude: event.location.latitude,
    longitude: event.location.longitude,
    title: event.title,
    description: event.location.name,
    testID: `marker-${event.id}`,
  }));

  return (
    <View style={styles.container} testID="all-events-map-view">
      <LeafletMapView
        center={CAMPUS_CENTER_COORDS}
        zoom={14}
        markers={markers}
        onMarkerClick={onSelectEvent}
        style={styles.map}
        testID="all-events-map"
      />
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
});
