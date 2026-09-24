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
