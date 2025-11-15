# Dashboard App

A React Native mobile app that provides a dashboard with buttons linking to various websites. Each button can store and display associated credentials (username, password, email).

## Features

- Dashboard with buttons for multiple websites
- Tap a button to open the website in the default browser
- Long press a button to view stored credentials
- Persistent storage of website data using AsyncStorage

## Getting Started

1. Ensure you have Node.js and npm installed.
2. Install Expo CLI globally: `npm install -g @expo/cli`
3. Navigate to the project directory: `cd "a:\experiment Project1"`
4. Install dependencies: `npm install`
5. Start the development server: `npm start` or `expo start`

## Running on Device

- For Android: `npm run android` or `expo start --android`
- For iOS: `npm run ios` or `expo start --ios`
- For Web: `npm run web` or `expo start --web`

## Building an Android APK

There are two recommended ways to produce an APK from this Expo project:

1) Cloud build with EAS (recommended, no Android SDK required locally)

- Install EAS CLI: `npm install -g eas-cli` or use `npx eas`
- Log in to Expo: `npx expo login` (or `eas login`)
- Run the build (profile `preview` produces an APK):

```powershell
cd .\
npx eas build --platform android --profile preview
```

After the build finishes the EAS output will provide a download URL for the APK.

2) Local native build (requires Android Studio, Android SDK, JDK installed)

- Prebuild native projects and run the Gradle release task:

```powershell
cd .\
npm run build:android-local
```

This runs `expo prebuild` (generates `android/`) and then runs Gradle's `assembleRelease` via the wrapper. The built APK will be in `android\app\build\outputs\apk\release\`.

Notes & troubleshooting
- EAS builds require an Expo account and may prompt for credentials or signing keys.
- Local builds require the Android toolchain and can fail if the JAVA_HOME/ANDROID_HOME environment variables are not set.

## Adding Websites

Currently, the app starts with default websites (Google and GitHub). To add more websites or edit credentials, modify the `sites` array in `App.js` or implement an add/edit interface.

## Notes

- Credentials are stored locally using AsyncStorage and are not encrypted. For production use, consider using secure storage solutions.
- The app uses Expo for easier development and deployment.