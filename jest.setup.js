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

// Mock expo-location
jest.mock('expo-location', () => ({
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
    canAskAgain: true,
    status: 'granted',
  }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 13.7563,
      longitude: 100.5018,
    },
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([
    {
      name: 'Innovative Learning Hub',
      street: 'Campus Main Ave',
      district: 'Dusit',
      city: 'Bangkok',
    },
  ]),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      animateToRegion: jest.fn(),
      fitToCoordinates: jest.fn(),
    }));
    return React.createElement(
      View,
      { ...props, testID: props.testID || 'mock-map-view' },
      props.children
    );
  });

  const MockMarker = (props) =>
    React.createElement(
      View,
      { ...props, testID: props.testID || 'mock-marker' },
      props.children
    );

  const MockCallout = (props) =>
    React.createElement(
      View,
      { ...props, testID: props.testID || 'mock-callout' },
      props.children
    );

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
    PROVIDER_DEFAULT: 'default',
    PROVIDER_GOOGLE: 'google',
  };
});
