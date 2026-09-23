import {
  getCurrentCoordinates,
  reverseGeocodeLocation,
  openExternalDirections,
  CAMPUS_CENTER_COORDS,
} from '../../services/location';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

describe('Unit Test: location service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has valid default campus center coordinates', () => {
    expect(CAMPUS_CENTER_COORDS.latitude).toBeCloseTo(13.7563);
    expect(CAMPUS_CENTER_COORDS.longitude).toBeCloseTo(100.5018);
  });

  it('fetches current coordinates successfully with Accuracy.Balanced', async () => {
    const coords = await getCurrentCoordinates();
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
      accuracy: Location.Accuracy.Balanced,
    });
    expect(coords).toEqual({ latitude: 13.7563, longitude: 100.5018 });
  });

  it('throws error when location permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
      canAskAgain: true,
      status: 'denied',
    });

    await expect(getCurrentCoordinates()).rejects.toThrow('location-permission-denied');
  });

  it('returns readable location string from reverse geocode', async () => {
    const name = await reverseGeocodeLocation({ latitude: 13.7563, longitude: 100.5018 });
    expect(Location.reverseGeocodeAsync).toHaveBeenCalledWith({
      latitude: 13.7563,
      longitude: 100.5018,
    });
    expect(name).toBe('Innovative Learning Hub, Campus Main Ave, Dusit');
  });

  it('opens external map directions URL', async () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any);
    const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);

    await openExternalDirections({ latitude: 13.7563, longitude: 100.5018 }, 'Campus Event');

    expect(openURLSpy).toHaveBeenCalledTimes(1);
    const calledUrl = openURLSpy.mock.calls[0][0];
    expect(calledUrl).toContain('13.7563,100.5018');

    openURLSpy.mockRestore();
    canOpenURLSpy.mockRestore();
  });
});
