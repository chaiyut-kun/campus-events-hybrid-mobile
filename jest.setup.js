import React from 'react';
import { View } from 'react-native';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(View, { ...props, testID: props.name }),
    Feather: (props) => React.createElement(View, { ...props, testID: props.name }),
  };
});

// Mock expo-camera
jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');

  const CameraView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      takePictureAsync: jest.fn().mockResolvedValue({
        uri: 'file://mock-camera-photo.jpg',
        width: 1080,
        height: 1920,
      }),
    }));
    return React.createElement(View, { ...props, testID: 'mock-camera-view' });
  });

  return {
    CameraView,
    useCameraPermissions: jest.fn(() => [
      { granted: true, canAskAgain: true, status: 'granted' },
      jest.fn().mockResolvedValue({ granted: true, canAskAgain: true, status: 'granted' }),
    ]),
  };
});

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
    canAskAgain: true,
    status: 'granted',
  }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [
      {
        uri: 'file://mock-picked-image.jpg',
        width: 800,
        height: 600,
        fileSize: 1024 * 500, // 500 KB
        mimeType: 'image/jpeg',
      },
    ],
  }),
}));
