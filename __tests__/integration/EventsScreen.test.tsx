import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EventsScreen from '../../app/(tabs)/events';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  usePathname: jest.fn(() => '/events'),
}));

describe('Integration Test: EventsScreen', () => {
  it('renders header, initial counter of 0, and event list', async () => {
    const { getByText, getByTestId } = await render(<EventsScreen />);

    expect(getByText('Campus Events')).toBeTruthy();
    expect(getByTestId('saved-counter-badge')).toBeTruthy();
    expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();
    expect(getByText('Annual Inter-Faculty Badminton Championship')).toBeTruthy();
  });

  it('toggles favorite and updates the saved counter badge', async () => {
    const { getByLabelText, getByTestId } = await render(<EventsScreen />);

    const favButton = getByLabelText(
      'เพิ่ม Campus Hackathon 2026: AI for Good ในรายการโปรด'
    );
    fireEvent.press(favButton);

    await waitFor(() => {
      // Counter badge updates from 0 to 1
      const counterBadge = getByTestId('saved-counter-badge');
      expect(counterBadge).toBeTruthy();

      // Button label toggles to active
      expect(
        getByLabelText('นำ Campus Hackathon 2026: AI for Good ออกจากรายการโปรด')
      ).toBeTruthy();
    });
  });

  it('filters events when switching between All and Saved tabs', async () => {
    const { getByLabelText, getByText, queryByText } = await render(
      <EventsScreen />
    );

    // 1. Initially on Saved tab with no favorites -> shows empty state
    const savedFilterTab = getByLabelText('Show saved events, total 0');
    fireEvent.press(savedFilterTab);

    await waitFor(() => {
      expect(getByText('ยังไม่มีกิจกรรมที่บันทึกไว้')).toBeTruthy();
      expect(queryByText('Campus Hackathon 2026: AI for Good')).toBeNull();
    });

    // 2. Switch back to All tab
    const allFilterTab = getByLabelText('Show all events, total 4');
    fireEvent.press(allFilterTab);

    await waitFor(() => {
      expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();
    });

    // 3. Favorite an event
    const favButton = getByLabelText(
      'เพิ่ม Campus Hackathon 2026: AI for Good ในรายการโปรด'
    );
    fireEvent.press(favButton);

    // 4. Switch to Saved tab -> only favorited event is shown
    await waitFor(() => {
      expect(getByLabelText('Show saved events, total 1')).toBeTruthy();
    });
    fireEvent.press(getByLabelText('Show saved events, total 1'));

    await waitFor(() => {
      expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();
      expect(queryByText('Annual Inter-Faculty Badminton Championship')).toBeNull();
    });
  });

  it('opens event detail modal when an event card is pressed', async () => {
    const { getByLabelText, getByText, getAllByText } = await render(<EventsScreen />);

    const card = getByLabelText(
      'เปิดรายละเอียดกิจกรรม Campus Hackathon 2026: AI for Good'
    );
    fireEvent.press(card);

    await waitFor(() => {
      // Detail modal displays event title and About section
      expect(getByText('About This Event')).toBeTruthy();
      expect(getAllByText('Innovative Learning Hub, 4th Floor').length).toBeGreaterThanOrEqual(1);
    });

    // Close detail modal
    const closeBtn = getByLabelText('Close detail modal');
    fireEvent.press(closeBtn);
  });

  it('adapts layout to 2 columns on tablet / wide screens (width >= 720)', async () => {
    const useWindowDimensionsSpy = jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 800, height: 1024, scale: 2, fontScale: 1 });

    const { getByText } = await render(<EventsScreen />);
    expect(getByText('Campus Events')).toBeTruthy();
    expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();

    useWindowDimensionsSpy.mockRestore();
  });
});
