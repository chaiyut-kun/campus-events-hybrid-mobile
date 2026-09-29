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

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue({}),
  getPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    granted: true,
    canAskAgain: true,
  }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    granted: true,
    canAskAgain: true,
  }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('mock-notification-id-123'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  getLastNotificationResponse: jest.fn().mockReturnValue(null),
  clearLastNotificationResponse: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn().mockReturnValue({
    remove: jest.fn(),
  }),
  addNotificationReceivedListener: jest.fn().mockReturnValue({
    remove: jest.fn(),
  }),
  SchedulableTriggerInputTypes: {
    DATE: 'date',
    TIME_INTERVAL: 'timeInterval',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  },
  AndroidImportance: {
    UNKNOWN: 0,
    MIN: 1,
    LOW: 2,
    DEFAULT: 3,
    HIGH: 4,
    MAX: 5,
  },
  DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  if (AsyncStorage && typeof AsyncStorage.clear === 'function') {
    await AsyncStorage.clear();
  }
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    getItemAsync: jest.fn(async (key) => store.get(key) || null),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    closeAsync: jest.fn().mockResolvedValue(undefined),
  };
  return {
    openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
  };
});

