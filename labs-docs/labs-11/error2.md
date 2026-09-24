
Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [Error: Cannot find native module 'ExpoTopicSubscriptionModule']

Code: _layout.tsx
  1 | import React, { useEffect } from 'react';
  2 | import { Stack, router } from 'expo-router';
> 3 | import * as Notifications from 'expo-notifications';
    | ^
  4 | import { FavoritesProvider } from '../context/FavoritesContext';
  5 | import { EventsProvider } from '../context/EventsContext';
  6 | import {
Call Stack
  <global> (app/_layout.tsx:3)
 ERROR  [TypeError: Cannot read property 'ErrorBoundary' of undefined]

Code: useScreens.js
  139 |     }), [sorted, protectedScreens]);
  140 | }
> 141 | function fromImport(value, { ErrorBoundary, SuspenseFallback, unstable_settings, ...component }) {
      | ^
  142 |     // If possible, add a more helpful display name for the component stack to improve debugging of React errors such as `Text strings must be rendered within a <Text> component.`.
  143 |     if (component?.default && __DEV__) {
  144 |         component.default.displayName ??= `${component.default.name ?? 'Route'}(${value.contextKey})`;
Call Stack
  fromImport (node_modules/expo-router/build/useScreens.js:141)
  getQualifiedRouteComponent (node_modules/expo-router/build/useScreens.js:219:34)
  useStore (node_modules/expo-router/build/global-state/useStore.js:55:68)
  ContextNavigator (node_modules/expo-router/build/ExpoRoot.js:122:46)
  callComponent.react_stack_bottom_frame (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:17130:29)
  renderWithHooks (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:5648:40)
  updateFunctionComponent (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:8081:34)
  beginWork (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:9340:41)
  run (<native>)
  runWithFiberInDEV (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:697:33)
  performUnitOfWork (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:14134:39)
  workLoopSync (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:13966:58)
  renderRootSync (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:13947:23)
  performWorkOnRoot (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:13160:43)
  performWorkOnRootViaSchedulerTask (node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:3673:24)

Code: ExpoRoot.js
  83 |                     initialMetrics: INITIAL_METRICS, children: children }) }) }));
  84 |     }, [ParentWrapper]);
> 85 |     return (0, jsx_runtime_1.jsx)(ContextNavigator, { ...props, wrapper: wrapper });
     |                                 ^
  86 | }
  87 | const initialUrl = react_native_1.Platform.OS === 'web' && typeof window !== 'undefined'
  88 |     ? new URL(window.location.href)
Call Stack
  ExpoRoot (node_modules/expo-router/build/ExpoRoot.js:85:33)
  App (node_modules/expo-router/build/qualified-entry.js:20:91)
  WithDevTools (node_modules/expo/src/launch/withDevTools.tsx:21:12)
