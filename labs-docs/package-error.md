 npx expo-doctor
20/21 checks passed. 1 checks failed. Possible issues detected:
Use the --verbose flag to see more details about passed checks.

✖ Check that packages match versions required by installed Expo SDK

❗ Major version mismatches
package             expected  found
@types/jest         29.5.14   30.0.0
jest                ~29.7.0   30.5.2

🔧 Patch version mismatches
package             expected  found
expo                ~57.0.27  57.0.24
expo-asset          ~57.0.19  57.0.18
expo-camera         ~57.0.6   57.0.5
expo-constants      ~57.0.21  57.0.19
expo-image-picker   ~57.0.20  57.0.19
expo-linking        ~57.0.12  57.0.10
expo-location       ~57.0.20  57.0.19
expo-notifications  ~57.0.22  57.0.20
expo-router         ~57.0.25  57.0.22
expo-sqlite         ~57.0.4   57.0.3

Changelogs:
- expo-asset → https://github.com/expo/expo/blob/sdk-57/packages/expo-asset/CHANGELOG.md
- expo-camera → https://github.com/expo/expo/blob/sdk-57/packages/expo-camera/CHANGELOG.md
- expo-constants → https://github.com/expo/expo/blob/sdk-57/packages/expo-constants/CHANGELOG.md
- expo-image-picker → https://github.com/expo/expo/blob/sdk-57/packages/expo-image-picker/CHANGELOG.md
- expo-linking → https://github.com/expo/expo/blob/sdk-57/packages/expo-linking/CHANGELOG.md
- expo-location → https://github.com/expo/expo/blob/sdk-57/packages/expo-location/CHANGELOG.md
- expo-notifications → https://github.com/expo/expo/blob/sdk-57/packages/expo-notifications/CHANGELOG.md
- expo-router → https://github.com/expo/expo/blob/sdk-57/packages/expo-router/CHANGELOG.md
- expo-sqlite → https://github.com/expo/expo/blob/sdk-57/packages/expo-sqlite/CHANGELOG.md

12 packages out of date.
Advice:
Use 'npx expo install --check' to review and upgrade your dependencies.
To ignore specific packages, add them to "expo.install.exclude" in package.json. Learn more.

1 check failed, indicating possible issues with the project.

┌──(kun034㉿kali)-[~/…/cs/4/hybrid-mobile/campus-events]
└─$ npx expo install --check
The following packages should be updated for best compatibility with the installed expo version:
  expo@57.0.24 - expected version: ~57.0.27
  expo-asset@57.0.18 - expected version: ~57.0.19
  expo-camera@57.0.5 - expected version: ~57.0.6
  expo-constants@57.0.19 - expected version: ~57.0.21
  expo-image-picker@57.0.19 - expected version: ~57.0.20
  expo-linking@57.0.10 - expected version: ~57.0.12
  expo-location@57.0.19 - expected version: ~57.0.20
  expo-notifications@57.0.20 - expected version: ~57.0.22
  expo-router@57.0.22 - expected version: ~57.0.25
  expo-sqlite@57.0.3 - expected version: ~57.0.4
  @types/jest@30.0.0 - expected version: 29.5.14
  jest@30.5.2 - expected version: ~29.7.0
Your project may not work correctly until you install the expected versions of the packages.
✔ Fix dependencies? … yes
› Installing 12 SDK 57.0.0 compatible native modules using npm
> npm install
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: jest-watch-typeahead@2.2.1
npm warn Found: jest@30.5.2
npm warn node_modules/jest
npm warn   dev jest@"^30.5.2" from the root project
npm warn   1 more (@testing-library/react-native)
npm warn
npm warn Could not resolve dependency:
npm warn peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn node_modules/jest-watch-typeahead
npm warn   jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn   node_modules/jest-expo
npm warn
npm warn Conflicting peer dependency: jest@29.7.0
npm warn node_modules/jest
npm warn   peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn   node_modules/jest-watch-typeahead
npm warn     jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn     node_modules/jest-expo
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-reconciler@0.34.0
npm warn Found: react@19.2.3
npm warn node_modules/react
npm warn   react@"19.2.3" from the root project
npm warn   66 more (@expo/devtools, @expo/dom-webview, @expo/log-box, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"^19.3.0" from react-reconciler@0.34.0
npm warn node_modules/react-reconciler
npm warn   react-reconciler@"~0.34.0" from test-renderer@1.3.0
npm warn   node_modules/test-renderer
npm warn
npm warn Conflicting peer dependency: react@19.3.0
npm warn node_modules/react
npm warn   peer react@"^19.3.0" from react-reconciler@0.34.0
npm warn   node_modules/react-reconciler
npm warn     react-reconciler@"~0.34.0" from test-renderer@1.3.0
npm warn     node_modules/test-renderer
npm warn ERESOLVE overriding peer dependency

> campus-events@1.0.0 postinstall
> node scripts/patch-notifications.js

[patch-notifications] Patched warnOfExpoGoPushUsage.js to warn instead of throwing in Expo Go.
[patch-notifications] Patched DevicePushTokenAutoRegistration.fx.js for Expo Go.
[patch-notifications] Patched TopicSubscriptionModule.android.js for Expo Go Android.
[patch-notifications] Patched PushTokenManager.native.js with safe fallback for Expo Go.

added 20 packages, changed 28 packages, and audited 1089 packages in 3m

92 packages are looking for funding
  run `npm fund` for details

63 vulnerabilities (24 moderate, 38 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
› Running npx expo install under the updated expo version
> expo install --fix
The following packages should be updated for best compatibility with the installed expo version:
  expo-asset@57.0.18 - expected version: ~57.0.19
  expo-camera@57.0.5 - expected version: ~57.0.6
  expo-constants@57.0.19 - expected version: ~57.0.21
  expo-image-picker@57.0.19 - expected version: ~57.0.20
  expo-linking@57.0.10 - expected version: ~57.0.12
  expo-location@57.0.19 - expected version: ~57.0.20
  expo-notifications@57.0.20 - expected version: ~57.0.22
  expo-router@57.0.22 - expected version: ~57.0.25
  expo-sqlite@57.0.3 - expected version: ~57.0.4
  @types/jest@30.0.0 - expected version: 29.5.14
  jest@30.5.2 - expected version: ~29.7.0
Your project may not work correctly until you install the expected versions of the packages.
› Installing 11 SDK 57.0.0 compatible native modules using npm
> npm install
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: expo-modules-core@57.0.21
npm warn Found: react-native-worklets@0.13.0
npm warn node_modules/react-native-worklets
npm warn   peer react-native-worklets@"0.13.x" from react-native-reanimated@4.7.1
npm warn   node_modules/react-native-reanimated
npm warn     peer react-native-reanimated@">= 2.0.0" from react-native-drawer-layout@4.2.10
npm warn     node_modules/react-native-drawer-layout
npm warn     1 more (expo-router)
npm warn
npm warn Could not resolve dependency:
npm warn peerOptional react-native-worklets@"^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0" from expo-modules-core@57.0.21
npm warn node_modules/expo-modules-core
npm warn   expo-modules-core@"~57.0.21" from expo@57.0.27
npm warn   node_modules/expo
npm warn
npm warn Conflicting peer dependency: react-native-worklets@0.10.4
npm warn node_modules/react-native-worklets
npm warn   peerOptional react-native-worklets@"^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0" from expo-modules-core@57.0.21
npm warn   node_modules/expo-modules-core
npm warn     expo-modules-core@"~57.0.21" from expo@57.0.27
npm warn     node_modules/expo
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: jest-watch-typeahead@2.2.1
npm warn Found: jest@30.5.2
npm warn node_modules/jest
npm warn   dev jest@"^30.5.2" from the root project
npm warn   1 more (@testing-library/react-native)
npm warn
npm warn Could not resolve dependency:
npm warn peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn node_modules/jest-watch-typeahead
npm warn   jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn   node_modules/jest-expo
npm warn
npm warn Conflicting peer dependency: jest@29.7.0
npm warn node_modules/jest
npm warn   peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn   node_modules/jest-watch-typeahead
npm warn     jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn     node_modules/jest-expo
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: react-dom@19.3.0
npm error Found: react@19.2.3
npm error node_modules/react
npm error   react@"19.2.3" from the root project
npm error   peerOptional react@"*" from @expo/devtools@57.0.1
npm error   node_modules/@expo/devtools
npm error     @expo/devtools@"~57.0.1" from expo@57.0.27
npm error     node_modules/expo
npm error       expo@"~57.0.27" from the root project
npm error       24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error   53 more (@expo/dom-webview, @expo/log-box, @expo/vector-icons, ...)
npm error
npm error Could not resolve dependency:
npm error peer react@"^19.3.0" from react-dom@19.3.0
npm error node_modules/react-dom
npm error   peerOptional react-dom@"*" from expo@57.0.27
npm error   node_modules/expo
npm error     expo@"~57.0.27" from the root project
npm error     24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error   peerOptional react-dom@"*" from @expo/router-server@57.0.12
npm error   node_modules/expo/node_modules/@expo/cli/node_modules/@expo/router-server
npm error     @expo/router-server@"^57.0.12" from @expo/cli@57.0.28
npm error     node_modules/expo/node_modules/@expo/cli
npm error       @expo/cli@"^57.0.28" from expo@57.0.27
npm error   9 more (expo-router, @expo/metro-runtime, ...)
npm error
npm error Conflicting peer dependency: react@19.3.0
npm error node_modules/react
npm error   peer react@"^19.3.0" from react-dom@19.3.0
npm error   node_modules/react-dom
npm error     peerOptional react-dom@"*" from expo@57.0.27
npm error     node_modules/expo
npm error       expo@"~57.0.27" from the root project
npm error       24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error     peerOptional react-dom@"*" from @expo/router-server@57.0.12
npm error     node_modules/expo/node_modules/@expo/cli/node_modules/@expo/router-server
npm error       @expo/router-server@"^57.0.12" from @expo/cli@57.0.28
npm error       node_modules/expo/node_modules/@expo/cli
npm error         @expo/cli@"^57.0.28" from expo@57.0.27
npm error     9 more (expo-router, @expo/metro-runtime, ...)
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error /home/kun034/.npm/_logs/2026-10-07T16_04_24_554Z-eresolve-report.txt
npm error A complete log of this run can be found in: /home/kun034/.npm/_logs/2026-10-07T16_04_24_554Z-debug-0.log
Error: npm install exited with non-zero code: 1
Error: npm install exited with non-zero code: 1
    at ChildProcess.completionListener (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:113:23)
    at Object.onceWrapper (node:events:634:26)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
    ...
    at spawnAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:9:23)
    at NpmPackageManager.runAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/node/BasePackageManager.js:41:42)
    at /data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/node/NpmPackageManager.js:36:20
    at /data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/utils/spawn.js:14:34
Error: npx expo install --fix exited with non-zero code: 1
Error: npx expo install --fix exited with non-zero code: 1
    at ChildProcess.completionListener (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:113:23)
    at Object.onceWrapper (node:events:634:26)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
    ...
    at spawnAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:9:23)
    at installExpoPackageAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/expo/node_modules/@expo/cli/build/src/install/installExpoPackage.js:114:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async fixPackagesAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/expo/node_modules/@expo/cli/build/src/install/fixPackages.js:84:9)
    at async installAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/expo/node_modules/@expo/cli/build/src/install/installAsync.js:121:16)

┌──(kun034㉿kali)-[~/…/cs/4/hybrid-mobile/campus-events]
└─$ npx expo install --fix
The following packages should be updated for best compatibility with the installed expo version:
  expo-asset@57.0.18 - expected version: ~57.0.19
  expo-camera@57.0.5 - expected version: ~57.0.6
  expo-constants@57.0.19 - expected version: ~57.0.21
  expo-image-picker@57.0.19 - expected version: ~57.0.20
  expo-linking@57.0.10 - expected version: ~57.0.12
  expo-location@57.0.19 - expected version: ~57.0.20
  expo-notifications@57.0.20 - expected version: ~57.0.22
  expo-router@57.0.22 - expected version: ~57.0.25
  expo-sqlite@57.0.3 - expected version: ~57.0.4
  @types/jest@30.0.0 - expected version: 29.5.14
  jest@30.5.2 - expected version: ~29.7.0
Your project may not work correctly until you install the expected versions of the packages.
› Installing 11 SDK 57.0.0 compatible native modules using npm
> npm install
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: expo-modules-core@57.0.21
npm warn Found: react-native-worklets@0.13.0
npm warn node_modules/react-native-worklets
npm warn   peer react-native-worklets@"0.13.x" from react-native-reanimated@4.7.1
npm warn   node_modules/react-native-reanimated
npm warn     peer react-native-reanimated@">= 2.0.0" from react-native-drawer-layout@4.2.10
npm warn     node_modules/react-native-drawer-layout
npm warn     1 more (expo-router)
npm warn
npm warn Could not resolve dependency:
npm warn peerOptional react-native-worklets@"^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0" from expo-modules-core@57.0.21
npm warn node_modules/expo-modules-core
npm warn   expo-modules-core@"~57.0.21" from expo@57.0.27
npm warn   node_modules/expo
npm warn
npm warn Conflicting peer dependency: react-native-worklets@0.10.4
npm warn node_modules/react-native-worklets
npm warn   peerOptional react-native-worklets@"^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0" from expo-modules-core@57.0.21
npm warn   node_modules/expo-modules-core
npm warn     expo-modules-core@"~57.0.21" from expo@57.0.27
npm warn     node_modules/expo
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: jest-watch-typeahead@2.2.1
npm warn Found: jest@30.5.2
npm warn node_modules/jest
npm warn   dev jest@"^30.5.2" from the root project
npm warn   1 more (@testing-library/react-native)
npm warn
npm warn Could not resolve dependency:
npm warn peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn node_modules/jest-watch-typeahead
npm warn   jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn   node_modules/jest-expo
npm warn
npm warn Conflicting peer dependency: jest@29.7.0
npm warn node_modules/jest
npm warn   peer jest@"^27.0.0 || ^28.0.0 || ^29.0.0" from jest-watch-typeahead@2.2.1
npm warn   node_modules/jest-watch-typeahead
npm warn     jest-watch-typeahead@"2.2.1" from jest-expo@57.0.5
npm warn     node_modules/jest-expo
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: react-dom@19.3.0
npm error Found: react@19.2.3
npm error node_modules/react
npm error   react@"19.2.3" from the root project
npm error   peerOptional react@"*" from @expo/devtools@57.0.1
npm error   node_modules/@expo/devtools
npm error     @expo/devtools@"~57.0.1" from expo@57.0.27
npm error     node_modules/expo
npm error       expo@"~57.0.27" from the root project
npm error       24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error   53 more (@expo/dom-webview, @expo/log-box, @expo/vector-icons, ...)
npm error
npm error Could not resolve dependency:
npm error peer react@"^19.3.0" from react-dom@19.3.0
npm error node_modules/react-dom
npm error   peerOptional react-dom@"*" from expo@57.0.27
npm error   node_modules/expo
npm error     expo@"~57.0.27" from the root project
npm error     24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error   peerOptional react-dom@"*" from @expo/router-server@57.0.12
npm error   node_modules/expo/node_modules/@expo/cli/node_modules/@expo/router-server
npm error     @expo/router-server@"^57.0.12" from @expo/cli@57.0.28
npm error     node_modules/expo/node_modules/@expo/cli
npm error       @expo/cli@"^57.0.28" from expo@57.0.27
npm error   9 more (expo-router, @expo/metro-runtime, ...)
npm error
npm error Conflicting peer dependency: react@19.3.0
npm error node_modules/react
npm error   peer react@"^19.3.0" from react-dom@19.3.0
npm error   node_modules/react-dom
npm error     peerOptional react-dom@"*" from expo@57.0.27
npm error     node_modules/expo
npm error       expo@"~57.0.27" from the root project
npm error       24 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error     peerOptional react-dom@"*" from @expo/router-server@57.0.12
npm error     node_modules/expo/node_modules/@expo/cli/node_modules/@expo/router-server
npm error       @expo/router-server@"^57.0.12" from @expo/cli@57.0.28
npm error       node_modules/expo/node_modules/@expo/cli
npm error         @expo/cli@"^57.0.28" from expo@57.0.27
npm error     9 more (expo-router, @expo/metro-runtime, ...)
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error /home/kun034/.npm/_logs/2026-10-07T16_06_17_833Z-eresolve-report.txt
npm error A complete log of this run can be found in: /home/kun034/.npm/_logs/2026-10-07T16_06_17_833Z-debug-0.log
Error: npm install exited with non-zero code: 1
Error: npm install exited with non-zero code: 1
    at ChildProcess.completionListener (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:113:23)
    at Object.onceWrapper (node:events:634:26)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
    ...
    at spawnAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/spawn-async/build/spawnAsync.js:9:23)
    at NpmPackageManager.runAsync (/data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/node/BasePackageManager.js:41:42)
    at /data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/node/NpmPackageManager.js:36:20
    at /data/cs/4/hybrid-mobile/campus-events/node_modules/@expo/package-manager/build/utils/spawn.js:14:34
