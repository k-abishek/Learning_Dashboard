# Learning Dashboard

A React Native mobile app built with Expo SDK 54 that provides a dashboard with buttons linking to various websites. Each button can store and display associated credentials (username, password, email).

## Features

- Dashboard with buttons for multiple websites
- Tap a button to open the website in the default browser
- Long press a button to view stored credentials
- Persistent storage of website data using AsyncStorage

## Prerequisites

- Node.js (version 18 or later)
- npm or yarn
- Expo CLI (install globally: `npm install -g @expo/cli`)

## Installation

1. Clone the repository or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

Start the development server:
```bash
npm start
# or
expo start
```

This will open the Expo DevTools in your browser. You can then:
- Scan the QR code with the Expo Go app on your phone.
- Press 'a' for Android emulator, 'i' for iOS simulator, 'w' for web.

## Building an APK

### Cloud Build with EAS (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to Expo:
   ```bash
   npx expo login
   ```

3. Run the build:
   ```bash
   npx eas build --platform android --profile preview
   ```

After the build completes, EAS will provide a download URL for the APK.

### Local Build (Requires Android SDK)

1. Prebuild the native project:
   ```bash
   npx expo prebuild
   ```

2. Build the APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

The APK will be in `android/app/build/outputs/apk/release/`.

## Project Structure

- `App.js`: Main app component
- `app.json`: Expo configuration
- `package.json`: Dependencies and scripts
- `assets/`: Static assets
- `.gitignore`: Files and directories ignored by Git (includes node_modules, build artifacts, etc.)

## Adding Websites

Modify the `sites` array in `App.js` to add more websites or edit credentials.

## Notes

- Credentials are stored locally using AsyncStorage and are not encrypted. For production, consider secure storage.
- The app uses Expo for simplified development and deployment.

## Troubleshooting

- If you encounter dependency issues, try `npm install --legacy-peer-deps`
- For EAS builds, ensure you have an Expo account and follow the prompts for signing keys.