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

## Adding Websites

Currently, the app starts with default websites (Google and GitHub). To add more websites or edit credentials, modify the `sites` array in `App.js` or implement an add/edit interface.

## Notes

- Credentials are stored locally using AsyncStorage and are not encrypted. For production use, consider using secure storage solutions.
- The app uses Expo for easier development and deployment.