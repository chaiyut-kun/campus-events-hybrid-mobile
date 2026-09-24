 ERROR  [Error: expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notificatio
ns was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go. Learn more at https://docs.e
xpo.dev/develop/development-builds/introduction/.] 

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
