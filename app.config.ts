export default {
  expo: {
    plugins: ['expo-font', 'expo-image', 'expo-router', 'expo-web-browser'],
    userInterfaceStyle: 'automatic',
    extra: {
      apiBaseUrl: process.env.API_BASE_URL ?? 'https://pokeapi.co/api/v2',
    },
    android: {
      package: 'com.kako351.pokedex.android',
    },
    ios: {
      bundleIdentifier: 'com.kako351.pokedex.ios',
    },
  },
};
