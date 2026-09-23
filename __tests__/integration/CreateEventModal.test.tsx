import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateEventModal } from '../../components/CreateEventModal';

describe('Integration Test: CreateEventModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields, empty image placeholder, and submit button', async () => {
    const { getByText, getByTestId } = await render(
      <CreateEventModal {...defaultProps} />
    );

    expect(getByText('สร้างกิจกรรมใหม่')).toBeTruthy();
    expect(getByTestId('input-event-title')).toBeTruthy();
    expect(getByTestId('input-event-location')).toBeTruthy();
    expect(getByTestId('input-event-description')).toBeTruthy();
    expect(getByTestId('open-image-picker-btn')).toBeTruthy();
    expect(getByTestId('create-event-submit-btn')).toBeTruthy();
  });

  it('validates required fields on submit and displays inline errors', async () => {
    const { getByTestId, getByText } = await render(
      <CreateEventModal {...defaultProps} />
    );

    // Press submit with empty form
    fireEvent.press(getByTestId('create-event-submit-btn'));

    await waitFor(() => {
      expect(getByText('กรุณากรอกชื่อกิจกรรม')).toBeTruthy();
      expect(getByText('กรุณากรอกสถานที่จัดกิจกรรม')).toBeTruthy();
      expect(getByText('กรุณากรอกรายละเอียดกิจกรรม')).toBeTruthy();
      expect(getByText('กรุณาถ่ายรูปหรือเลือกภาพประกอบกิจกรรม')).toBeTruthy();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('selects image from library, shows preview, and allows removing image', async () => {
    const { getByTestId, queryByTestId, getByText } = await render(
      <CreateEventModal {...defaultProps} />
    );

    // 1. Open action sheet
    fireEvent.press(getByTestId('open-image-picker-btn'));
    await waitFor(() => {
      expect(getByText('เลือกภาพประกอบกิจกรรม')).toBeTruthy();
    });

    // 2. Select choose from library
    fireEvent.press(getByTestId('action-choose-library'));

    // 3. Image preview should appear
    await waitFor(() => {
      expect(getByTestId('image-preview-container')).toBeTruthy();
      expect(getByTestId('replace-image-btn')).toBeTruthy();
      expect(getByTestId('remove-image-btn')).toBeTruthy();
    });

    // 4. Remove image
    fireEvent.press(getByTestId('remove-image-btn'));

    await waitFor(() => {
      expect(queryByTestId('image-preview-container')).toBeNull();
      expect(getByTestId('open-image-picker-btn')).toBeTruthy();
    });
  });

  it('preserves text input data when image picker action sheet is canceled', async () => {
    const { getByTestId, getByText, queryByText } = await render(
      <CreateEventModal {...defaultProps} />
    );

    // Type in title and wait for state flush
    fireEvent.changeText(getByTestId('input-event-title'), 'My Special Event');
    await waitFor(() => {
      expect(getByTestId('input-event-title').props.value).toBe('My Special Event');
    });

    // Open action sheet and cancel
    fireEvent.press(getByTestId('open-image-picker-btn'));
    await waitFor(() => {
      expect(getByText('เลือกภาพประกอบกิจกรรม')).toBeTruthy();
    });

    fireEvent.press(getByTestId('action-cancel'));

    await waitFor(() => {
      expect(queryByText('เลือกภาพประกอบกิจกรรม')).toBeNull();
    });

    // Verify title is preserved
    expect(getByTestId('input-event-title').props.value).toBe('My Special Event');
  });

  it('submits valid form with image and triggers onSubmit', async () => {
    const { getByTestId } = await render(
      <CreateEventModal {...defaultProps} />
    );

    // 1. Pick image first
    fireEvent.press(getByTestId('open-image-picker-btn'));
    await waitFor(() => {
      expect(getByTestId('action-choose-library')).toBeTruthy();
    });

    fireEvent.press(getByTestId('action-choose-library'));

    await waitFor(() => {
      expect(getByTestId('image-preview-container')).toBeTruthy();
    });

    // 2. Fill text fields
    fireEvent.changeText(getByTestId('input-event-title'), 'AI Workshop 2026');
    fireEvent.changeText(getByTestId('input-event-location'), 'Lab 401');
    fireEvent.changeText(getByTestId('input-event-description'), 'Hands-on AI prototyping');

    // 3. Submit
    fireEvent.press(getByTestId('create-event-submit-btn'));

    // Wait for submission completion
    await waitFor(
      () => {
        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'AI Workshop 2026',
            location: expect.objectContaining({ name: 'Lab 401' }),
            description: 'Hands-on AI prototyping',
            imageUrl: 'file://mock-picked-image.jpg',
          })
        );
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );
  });
});
