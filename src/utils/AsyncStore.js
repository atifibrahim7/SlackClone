import AsyncStorage from '@react-native-community/async-storage';

import { ChatClientStore } from './ChatClientStore';

export default {
  flushGetRequests: () => AsyncStorage.flushGetRequests(),
  getAllKeys: () => AsyncStorage.getAllKeys(),
  getItem: async (key, defaultValue) => {
    const value = await AsyncStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    return JSON.parse(value);
  },
  multiGet: (keys) => AsyncStorage.multiGet(keys),
  removeItem: (key) => AsyncStorage.removeItem(key),
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
};

// Simple key functions (no user dependency)
export const getChannelDraftKey = (channelId) =>
  `@slack-clone-draft-${channelId}`;

export const getUserDraftKey = () => `@slack-clone-draft-user`;

export const getRecentSearchesKey = () => `@slack-clone-recent-searches`;

// Simple authentication storage
export const AuthStorage = {
  // Save login data
  async saveAuthData(authData) {
    const AsyncStore = (await import('./AsyncStore')).default;
    await AsyncStore.setItem('@slack-clone-user-id', authData.userId);
    await AsyncStore.setItem('@slack-clone-token', authData.token);
    await AsyncStore.setItem('@slack-clone-api-key', authData.apiKey);
    await AsyncStore.setItem(
      '@slack-clone-user-data',
      authData.user || authData.userData,
    );
    await AsyncStore.setItem('@slack-clone-logged-in', true);
  },

  // Get stored auth data
  async getAuthData() {
    try {
      const AsyncStore = (await import('./AsyncStore')).default;
      const userId = await AsyncStore.getItem('@slack-clone-user-id', null);
      const token = await AsyncStore.getItem('@slack-clone-token', null);
      const apiKey = await AsyncStore.getItem('@slack-clone-api-key', null);
      const userData = await AsyncStore.getItem('@slack-clone-user-data', null);
      const isLoggedIn = await AsyncStore.getItem(
        '@slack-clone-logged-in',
        false,
      );

      return { userId, token, apiKey, userData, isLoggedIn };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        userId: null,
        token: null,
        apiKey: null,
        userData: null,
        isLoggedIn: false,
      };
    }
  },

  // Clear all auth data (logout)
  async clearAuthData() {
    try {
      const AsyncStore = (await import('./AsyncStore')).default;
      await AsyncStore.removeItem('@slack-clone-user-id');
      await AsyncStore.removeItem('@slack-clone-token');
      await AsyncStore.removeItem('@slack-clone-api-key');
      await AsyncStore.removeItem('@slack-clone-user-data');
      await AsyncStore.removeItem('@slack-clone-logged-in');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const AsyncStore = (await import('./AsyncStore')).default;
      return await AsyncStore.getItem('@slack-clone-logged-in', false);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },
};
