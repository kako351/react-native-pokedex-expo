export default {
  expo: {
    plugins: [
      'expo-font',
      'expo-image',
      'expo-router',
      'expo-web-browser',
      'expo-system-ui',
    ],
    userInterfaceStyle: 'automatic',
    extra: {
      apiBaseUrl: process.env.API_BASE_URL ?? 'https://pokeapi.co/api/v2',
    },
    android: {
      package: 'com.kako351.pokedex.android',
      userInterfaceStyle: 'automatic',
    },
    ios: {
      bundleIdentifier: 'com.kako351.pokedex.ios',
      userInterfaceStyle: 'automatic',
    },
  },
};
