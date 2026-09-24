import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { FavoritesProvider } from '../context/FavoritesContext';
import { EventsProvider } from '../context/EventsContext';
import {
  configureNotificationHandler,
  extractEventIdFromResponse,
} from '../services/notification';

// Configure foreground banner & sound safely
try {
  configureNotificationHandler();
} catch (e) {
  console.warn('Failed to configure foreground notification handler:', e);
}

export default function RootLayout() {
  useEffect(() => {
    try {
      // 1. Cold start: check if app was opened via notification tap
      const initialResponse = Notifications.getLastNotificationResponse();
      if (initialResponse) {
        const eventId = extractEventIdFromResponse(initialResponse);
        if (eventId) {
          router.push({ pathname: '/events/[id]', params: { id: eventId } });
        }
        Notifications.clearLastNotificationResponse();
      }

      // 2. Active / Background response: listen to notification taps
      const subscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const eventId = extractEventIdFromResponse(response);
          if (eventId) {
            router.push({ pathname: '/events/[id]', params: { id: eventId } });
          }
        },
      );

      return () => subscription?.remove?.();
    } catch (e) {
      console.warn('Notification listener setup failed:', e);
    }
  }, []);

  return (
    <EventsProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="events/[id]" options={{ headerShown: false }} />
        </Stack>
      </FavoritesProvider>
    </EventsProvider>
  );
}

