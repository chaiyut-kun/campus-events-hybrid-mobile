import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EventVenueMap } from '../../components/EventVenueMap';
import { Linking } from 'react-native';

describe('Integration Test: EventVenueMap', () => {
  const venue = {
    name: 'Main Auditorium',
    latitude: 13.7563,
    longitude: 100.5018,
  };

  it('renders inline map and venue marker', async () => {
    const { getByTestId, getByText } = await render(
      <EventVenueMap venue={venue} eventTitle="Tech Summit 2026" />
    );

    expect(getByTestId('event-venue-map')).toBeTruthy();
    expect(getByTestId('venue-marker')).toBeTruthy();
    expect(getByText('เปิดแผนที่นำทาง')).toBeTruthy();
  });

  it('triggers external directions when button is pressed', async () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any);
    const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);

    const { getByTestId } = await render(
      <EventVenueMap venue={venue} eventTitle="Tech Summit 2026" />
    );

    fireEvent.press(getByTestId('open-directions-btn'));

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledTimes(1);
    });
    expect(openURLSpy.mock.calls[0][0]).toContain('13.7563,100.5018');

    openURLSpy.mockRestore();
    canOpenURLSpy.mockRestore();
  });
});
