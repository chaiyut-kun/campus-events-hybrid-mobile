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
