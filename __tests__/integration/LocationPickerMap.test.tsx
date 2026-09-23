import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LocationPickerMap } from '../../components/LocationPickerMap';
import * as Location from 'expo-location';

describe('Integration Test: LocationPickerMap', () => {
  const initialCoord = { latitude: 13.7563, longitude: 100.5018 };
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map, marker, and use current location button', async () => {
    const { getByTestId, getByText } = await render(
      <LocationPickerMap
        coordinate={initialCoord}
        onCoordinateChange={mockOnChange}
      />
    );

    expect(getByText('ปักหมุดสถานที่จัดงาน')).toBeTruthy();
    expect(getByTestId('use-current-location-btn')).toBeTruthy();
    expect(getByTestId('location-picker-map')).toBeTruthy();
    expect(getByTestId('picker-marker')).toBeTruthy();
  });

  it('fetches GPS coordinates and reverse geocode name when button is pressed', async () => {
    const { getByTestId } = await render(
      <LocationPickerMap
        coordinate={initialCoord}
        onCoordinateChange={mockOnChange}
      />
    );

    fireEvent.press(getByTestId('use-current-location-btn'));

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        { latitude: 13.7563, longitude: 100.5018 },
        'Innovative Learning Hub, Campus Main Ave, Dusit'
      );
    });
  });

  it('calls onCoordinateChange when map is pressed', async () => {
    const { getByTestId } = await render(
      <LocationPickerMap
        coordinate={initialCoord}
        onCoordinateChange={mockOnChange}
      />
    );

    const map = getByTestId('location-picker-map');
    fireEvent(map, 'onPress', {
      nativeEvent: { coordinate: { latitude: 13.76, longitude: 100.51 } },
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      latitude: 13.76,
      longitude: 100.51,
    });
  });
});
