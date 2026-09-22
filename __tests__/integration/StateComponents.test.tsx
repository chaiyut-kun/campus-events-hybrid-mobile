import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';

describe('Component Test: State Components (Loading, Error, Empty)', () => {
  describe('LoadingState', () => {
    it('renders activity indicator and accessible loading message', async () => {
      const { getByTestId, getByText } = await render(
        <LoadingState message="กำลังดึงข้อมูลกิจกรรม..." />
      );

      expect(getByTestId('loading-state-container')).toBeTruthy();
      expect(getByText('กำลังดึงข้อมูลกิจกรรม...')).toBeTruthy();
    });

    it('renders default message when message prop is omitted', async () => {
      const { getByText } = await render(<LoadingState />);
      expect(getByText('กำลังโหลดรายการกิจกรรม...')).toBeTruthy();
    });
  });

  describe('ErrorState', () => {
    it('renders error title, message, and triggers retry callback', async () => {
      const onRetry = jest.fn();
      const { getByTestId, getByText, getByRole } = await render(
        <ErrorState
          message="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
          onRetry={onRetry}
          retryLabel="ลองใหม่"
        />
      );

      expect(getByTestId('error-state-container')).toBeTruthy();
      expect(getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeTruthy();
      expect(getByText('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')).toBeTruthy();

      const retryButton = getByRole('button');
      fireEvent.press(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyState', () => {
    it('renders empty title, description, and triggers action callback', async () => {
      const onAction = jest.fn();
      const { getByTestId, getByText, getByRole } = await render(
        <EmptyState
          title="ไม่พบผลการค้นหา"
          description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง"
          actionLabel="ล้างตัวกรองทั้งหมด"
          onAction={onAction}
        />
      );

      expect(getByTestId('empty-state-container')).toBeTruthy();
      expect(getByText('ไม่พบผลการค้นหา')).toBeTruthy();
      expect(getByText('ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง')).toBeTruthy();

      const actionButton = getByRole('button');
      fireEvent.press(actionButton);
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });
});
