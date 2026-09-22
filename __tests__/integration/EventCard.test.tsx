import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EventCard } from '../../components/EventCard';
import { CampusEvent } from '../../types/event';

const mockEventWithImage: CampusEvent = {
  id: 'test-001',
  title: 'React Native Workshop',
  description: 'Hands-on cross platform development workshop.',
  startsAt: '2026-10-15T09:00:00Z',
  imageUrl: 'https://example.com/image.jpg',
  location: {
    name: 'Computer Lab 3',
    latitude: 13.75,
    longitude: 100.5,
  },
  category: 'Tech',
};

const mockEventWithoutImage: CampusEvent = {
  id: 'test-002',
  title: 'Badminton Finals',
  description: 'Annual faculty sports tournament.',
  startsAt: '2026-11-01T14:00:00Z',
  location: {
    name: 'Campus Gym',
    latitude: 13.76,
    longitude: 100.51,
  },
  category: 'Sports',
};

describe('Component Test: EventCard', () => {
  it('renders event details with image', async () => {
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByText } = await render(
      <EventCard
        event={mockEventWithImage}
        isFavorite={false}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(getByText('React Native Workshop')).toBeTruthy();
    expect(getByText('Tech')).toBeTruthy();
    expect(getByText('Computer Lab 3')).toBeTruthy();
    expect(getByText('Hands-on cross platform development workshop.')).toBeTruthy();
    expect(getByText('บันทึก')).toBeTruthy();
  });

  it('renders fallback placeholder when imageUrl is omitted', async () => {
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByTestId, getByText } = await render(
      <EventCard
        event={mockEventWithoutImage}
        isFavorite={false}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(getByTestId('event-card-placeholder')).toBeTruthy();
    expect(getByText('Badminton Finals')).toBeTruthy();
  });

  it('calls onOpen when card is pressed', async () => {
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByLabelText } = await render(
      <EventCard
        event={mockEventWithImage}
        isFavorite={false}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
    );

    const card = getByLabelText('เปิดรายละเอียดกิจกรรม React Native Workshop');
    fireEvent.press(card);

    expect(onOpen).toHaveBeenCalledWith('test-001');
    expect(onToggleFavorite).not.toHaveBeenCalled();
  });

  it('calls onToggleFavorite when favorite button is pressed without triggering onOpen', async () => {
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByLabelText } = await render(
      <EventCard
        event={mockEventWithImage}
        isFavorite={false}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
    );

    const favButton = getByLabelText('เพิ่ม React Native Workshop ในรายการโปรด');
    fireEvent.press(favButton);

    expect(onToggleFavorite).toHaveBeenCalledWith('test-001');
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('displays active favorite state when isFavorite is true', async () => {
    const onOpen = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByText, getByLabelText } = await render(
      <EventCard
        event={mockEventWithImage}
        isFavorite={true}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(getByText('บันทึกแล้ว')).toBeTruthy();
    expect(getByLabelText('นำ React Native Workshop ออกจากรายการโปรด')).toBeTruthy();
  });
});
