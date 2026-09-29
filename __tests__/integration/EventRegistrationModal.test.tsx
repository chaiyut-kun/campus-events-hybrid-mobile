import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { EventRegistrationModal } from '../../components/EventRegistrationModal';

const mockRegisterEvent = jest.fn();

jest.mock('../../services/events-api', () => ({
  registerEvent: (...args: any[]) => mockRegisterEvent(...args),
  getEvents: jest.fn().mockResolvedValue([]),
  getEventById: jest.fn(),
  ApiError: class ApiError extends Error {},
}));

describe('Integration Test: EventRegistrationModal', () => {
  const defaultProps = {
    visible: true,
    eventId: 'evt-001',
    eventTitle: 'Campus Hackathon 2026: AI for Good',
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterEvent.mockResolvedValue({ success: true, registrationId: 'reg-001' });
  });

  it('renders pre-filled profile fields and empty email field', async () => {
    const { getByTestId, getByText } = await render(
      <EventRegistrationModal {...defaultProps} />
    );

    expect(getByText('ลงทะเบียนเข้าร่วมกิจกรรม')).toBeTruthy();
    expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();

    const nameInput = getByTestId('input-fullName');
    expect(nameInput.props.value).toBe('Chaiyut Tavon');

    const idInput = getByTestId('input-studentId');
    expect(idInput.props.value).toBe('2024-CIS-8492');

    const facultyInput = getByTestId('input-faculty');
    expect(facultyInput.props.value).toBe('Computer and Information Science');

    const emailInput = getByTestId('input-email');
    expect(emailInput.props.value).toBe('');
  });

  it('validates required email field on submit and preserves inputs', async () => {
    const { getByTestId, getByText, queryByText } = await render(
      <EventRegistrationModal {...defaultProps} />
    );

    // Initial state: no errors
    expect(queryByText('อีเมลไม่ถูกต้อง')).toBeNull();

    // Submit with empty email
    const submitBtn = getByTestId('submit-btn');
    await fireEvent.press(submitBtn);

    // Error should be displayed near the email field
    await waitFor(() => {
      expect(getByText('อีเมลไม่ถูกต้อง')).toBeTruthy();
    });

    // Form inputs should still be preserved
    expect(getByTestId('input-fullName').props.value).toBe('Chaiyut Tavon');
    expect(getByTestId('input-studentId').props.value).toBe('2024-CIS-8492');
  });

  it('displays API error banner when registration fails and preserves form values', async () => {
    mockRegisterEvent.mockRejectedValueOnce(
      new Error('คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว')
    );

    const { getByTestId, getByText } = await render(
      <EventRegistrationModal {...defaultProps} />
    );

    const emailInput = getByTestId('input-email');
    await fireEvent.changeText(emailInput, 'student@university.ac.th');

    const submitBtn = getByTestId('submit-btn');
    await fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(getByTestId('api-error-banner')).toBeTruthy();
      expect(getByText('คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว')).toBeTruthy();
      expect(getByText('ยืนยันการลงทะเบียน')).toBeTruthy();
    });

    expect(mockRegisterEvent).toHaveBeenCalledTimes(1);

    // Form inputs should still be preserved
    expect(getByTestId('input-fullName').props.value).toBe('Chaiyut Tavon');
    expect(getByTestId('input-email').props.value).toBe('student@university.ac.th');
  });

  it('submits successfully when form is valid and displays in-modal success state', async () => {
    const { getByTestId, getByText } = await render(
      <EventRegistrationModal {...defaultProps} />
    );

    // Fill in valid email
    const emailInput = getByTestId('input-email');
    await fireEvent.changeText(emailInput, 'student@university.ac.th');

    // Submit
    const submitBtn = getByTestId('submit-btn');
    await fireEvent.press(submitBtn);

    await waitFor(
      () => {
        expect(getByText('ลงทะเบียนสำเร็จ!')).toBeTruthy();
      },
      { timeout: 2000 }
    );

    // Click close on success state
    const closeBtn = getByTestId('success-close-btn');
    await fireEvent.press(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
