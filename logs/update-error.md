 npx expo install --fix
The following packages should be updated for best compatibility with the installed expo version:
  expo@57.0.24 - expected version: ~57.0.26
  expo-camera@57.0.5 - expected version: ~57.0.6
  expo-constants@57.0.19 - expected version: ~57.0.20
  expo-image-picker@57.0.19 - expected version: ~57.0.20
  expo-linking@57.0.10 - expected version: ~57.0.11
  expo-location@57.0.19 - expected version: ~57.0.20
  expo-notifications@57.0.20 - expected version: ~57.0.21
  expo-router@57.0.22 - expected version: ~57.0.24
  @types/jest@30.0.0 - expected version: 29.5.14
  jest@30.5.2 - expected version: ~29.7.0
Your project may not work correctly until you install the expected versions of the packages.
› Installing 10 SDK 57.0.0 compatible native modules using npm
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
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: react-dom@19.3.0
npm error Found: react@19.2.3
npm error node_modules/react
npm error   react@"19.2.3" from the root project
npm error   peerOptional react@"*" from @expo/devtools@57.0.1
npm error   node_modules/@expo/devtools
npm error     @expo/devtools@"~57.0.1" from expo@57.0.26
npm error     node_modules/expo
npm error       expo@"~57.0.26" from the root project
npm error       25 more (@expo/dom-webview, @expo/log-box, expo-application, ...)
npm error   64 more (@expo/dom-webview, @expo/log-box, @expo/vector-icons, ...)
npm error
npm error Could not resolve dependency:
npm error peer react@"^19.3.0" from react-dom@19.3.0
npm error node_modules/react-dom
npm error   peerOptional react-dom@"*" from expo-router@57.0.22
npm error   node_modules/expo-router
npm error     expo-router@"~57.0.22" from the root project
npm error     1 more (@expo/cli)
npm error   peerOptional react-dom@"*" from @expo/metro-runtime@57.0.16
npm error   node_modules/expo-router/node_modules/@expo/metro-runtime
npm error     @expo/metro-runtime@"^57.0.16" from expo-router@57.0.22
npm error   14 more (@expo/ui, @radix-ui/react-collection, ...)
npm error
npm error Conflicting peer dependency: react@19.3.0
npm error node_modules/react
npm error   peer react@"^19.3.0" from react-dom@19.3.0
npm error   node_modules/react-dom
npm error     peerOptional react-dom@"*" from expo-router@57.0.22
npm error     node_modules/expo-router
npm error       expo-router@"~57.0.22" from the root project
npm error       1 more (@expo/cli)
npm error     peerOptional react-dom@"*" from @expo/metro-runtime@57.0.16
npm error     node_modules/expo-router/node_modules/@expo/metro-runtime
npm error       @expo/metro-runtime@"^57.0.16" from expo-router@57.0.22
npm error     14 more (@expo/ui, @radix-ui/react-collection, ...)
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error /home/kun034/.npm/_logs/2026-09-30T10_22_28_530Z-eresolve-report.txt
npm error A complete log of this run can be found in: /home/kun034/.npm/_logs/2026-09-30T10_22_28_530Z-debug-0.log
Cannot install the latest Expo package. Install expo@latest with npm and then run npx expo install again.
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
