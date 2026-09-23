import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ImagePickerActionSheet } from '../../components/ImagePickerActionSheet';

describe('Integration Test: ImagePickerActionSheet', () => {
  const defaultProps = {
    visible: true,
    onTakePhoto: jest.fn(),
    onChooseLibrary: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all options and title', async () => {
    const { getByText, getByTestId } = await render(
      <ImagePickerActionSheet {...defaultProps} />
    );

    expect(getByText('เลือกภาพประกอบกิจกรรม')).toBeTruthy();
    expect(getByTestId('action-take-photo')).toBeTruthy();
    expect(getByTestId('action-choose-library')).toBeTruthy();
    expect(getByTestId('action-cancel')).toBeTruthy();
  });

  it('triggers onTakePhoto when Take Photo option is pressed', async () => {
    const { getByTestId } = await render(
      <ImagePickerActionSheet {...defaultProps} />
    );

    fireEvent.press(getByTestId('action-take-photo'));
    expect(defaultProps.onTakePhoto).toHaveBeenCalledTimes(1);
  });

  it('triggers onChooseLibrary when Choose Library option is pressed', async () => {
    const { getByTestId } = await render(
      <ImagePickerActionSheet {...defaultProps} />
    );

    fireEvent.press(getByTestId('action-choose-library'));
    expect(defaultProps.onChooseLibrary).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when cancel button is pressed', async () => {
    const { getByTestId } = await render(
      <ImagePickerActionSheet {...defaultProps} />
    );

    fireEvent.press(getByTestId('action-cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
