const fs = require('fs');
const path = require('path');

// 1. Patch warnOfExpoGoPushUsage.js so it warns instead of crashing on Android in Expo Go
const warnFile = path.join(
  __dirname,
  '../node_modules/expo-notifications/build/warnOfExpoGoPushUsage.js',
);

if (fs.existsSync(warnFile)) {
  let content = fs.readFileSync(warnFile, 'utf8');
  if (content.includes('throw new Error(message);')) {
    content = content.replace(
      'throw new Error(message);',
      'console.warn(message);',
    );
    fs.writeFileSync(warnFile, content, 'utf8');
    console.log(
      '[patch-notifications] Patched warnOfExpoGoPushUsage.js to warn instead of throwing in Expo Go.',
    );
  }
}

// 2. Patch DevicePushTokenAutoRegistration.fx.js so top-level push registration doesn't crash Expo Go
const fxFile = path.join(
  __dirname,
  '../node_modules/expo-notifications/build/DevicePushTokenAutoRegistration.fx.js',
);

if (fs.existsSync(fxFile)) {
  let content = fs.readFileSync(fxFile, 'utf8');
  if (!content.includes('// [patched for expo go]')) {
    content = content.replace(
      'if (ServerRegistrationModule.getRegistrationInfoAsync) {',
      '// [patched for expo go]\ntry {\nif (ServerRegistrationModule.getRegistrationInfoAsync) {',
    );
    content =
      content +
      '\n} catch (e) { console.warn("[expo-notifications] Skipped push auto-registration in Expo Go:", e?.message); }\n';
    fs.writeFileSync(fxFile, content, 'utf8');
    console.log(
      '[patch-notifications] Patched DevicePushTokenAutoRegistration.fx.js for Expo Go.',
    );
  }
}

// 3. Patch TopicSubscriptionModule.android.js so missing ExpoTopicSubscriptionModule in Expo Go doesn't crash on Android
const topicModuleFile = path.join(
  __dirname,
  '../node_modules/expo-notifications/build/TopicSubscriptionModule.android.js',
);

if (fs.existsSync(topicModuleFile)) {
  let content = fs.readFileSync(topicModuleFile, 'utf8');
  if (content.includes("requireNativeModule('ExpoTopicSubscriptionModule')")) {
    content = `import { requireOptionalNativeModule } from 'expo-modules-core';
const nativeModule = requireOptionalNativeModule('ExpoTopicSubscriptionModule');
export default nativeModule || {
  addListener: () => {},
  removeListeners: () => {},
  subscribeToTopicAsync: () => Promise.resolve(null),
  unsubscribeFromTopicAsync: () => Promise.resolve(null),
};
`;
    fs.writeFileSync(topicModuleFile, content, 'utf8');
    console.log(
      '[patch-notifications] Patched TopicSubscriptionModule.android.js for Expo Go Android.',
    );
  }
}

// 4. Patch PushTokenManager.native.js defensively in case ExpoPushTokenManager is missing in Expo Go
const pushTokenManagerFile = path.join(
  __dirname,
  '../node_modules/expo-notifications/build/PushTokenManager.native.js',
);

if (fs.existsSync(pushTokenManagerFile)) {
  let content = fs.readFileSync(pushTokenManagerFile, 'utf8');
  if (content.includes("requireNativeModule('ExpoPushTokenManager')")) {
    content = `import { requireOptionalNativeModule, Platform } from 'expo-modules-core';
const nativeModule = requireOptionalNativeModule('ExpoPushTokenManager');
export default nativeModule || {
  getDevicePushTokenAsync: () => Promise.resolve(''),
  unregisterForNotificationsAsync: () => Promise.resolve(),
  addListener: () => ({ remove: () => {} }),
  removeListener: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  listenerCount: () => 0,
};
`;
    fs.writeFileSync(pushTokenManagerFile, content, 'utf8');
    console.log(
      '[patch-notifications] Patched PushTokenManager.native.js with safe fallback for Expo Go.',
    );
  }
}

