import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Default fallback coordinates: Campus Center (Bangkok)
 */
export const CAMPUS_CENTER_COORDS: Coordinates = {
  latitude: 13.7563,
  longitude: 100.5018,
};

/**
 * Requests foreground location permission and reads current position
 * using Accuracy.Balanced (efficient for battery & fast response).
 */
export async function getCurrentCoordinates(): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('location-permission-denied');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

/**
 * Converts coordinates into a readable venue/street name using reverse geocoding.
 */
export async function reverseGeocodeLocation(coords: Coordinates): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync(coords);
    if (!results || results.length === 0) return null;

    const first = results[0];
    const parts = [first.name, first.street, first.district].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : first.city || 'Campus Area';
  } catch (e) {
    console.error('Reverse geocode failed:', e);
    return null;
  }
}

/**
 * Opens external navigation app (Google Maps / Apple Maps) directed to venue coordinates,
 * with fallback to OpenStreetMap web (without query parameter to avoid Nominatim 400 error).
 */
export async function openExternalDirections(
  coords: Coordinates,
  label: string = 'Event Venue',
): Promise<void> {
  const destination = `${coords.latitude},${coords.longitude}`;
  const nativeUrl =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destination}&q=${encodeURIComponent(label)}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  const supported = await Linking.canOpenURL(nativeUrl).catch(() => false);
  if (supported) {
    await Linking.openURL(nativeUrl);
  } else {
    // Fallback to OpenStreetMap web without query parameter (prevents Nominatim 400 error)
    const osmFallbackUrl = `https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}#map=17/${coords.latitude}/${coords.longitude}`;
    await Linking.openURL(osmFallbackUrl);
  }
}
