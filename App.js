import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LogBox,
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Chat, OverlayProvider } from 'stream-chat-react-native';

import { DarkTheme, LightTheme } from './src/appTheme';
import { BottomTabs } from './src/components/BottomTabs';
import { SlackAppContext } from './src/contexts/SlackAppContext';
import useStreamChatTheme from './src/hooks/useStreamChatTheme';
import { ChannelListScreen } from './src/screens/ChannelListScreen/ChannelListScreen';
import { ChannelScreen } from './src/screens/ChannelScreen/ChannelScreen';
import { ChannelSearchScreen } from './src/screens/ChannelSearchScreen/ChannelSearchScreen';
import { JumpToSearchScreen } from './src/screens/ChannelSearchScreen/JumpToSearchScreen';
import { DirectMessagesScreen } from './src/screens/DirectMessagesScreen';
import { MentionsScreen } from './src/screens/MentionsScreen/MentionsScreen';
import { MessageSearchScreen } from './src/screens/MessageSearchScreen/MessageSearchScreen';
import { NewMessageScreen } from './src/screens/NewMessageScreen/NewMessageScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ShareMessageScreen } from './src/screens/ShareMessageScreen/ShareMessageScreen';
import { ThreadScreen } from './src/screens/ThreadScreen';
import { SimpleLoginScreen } from './src/screens/SimpleLoginScreen';
import { HEADER_HEIGHT } from './src/utils';
import { ChatClientStore } from './src/utils/ChatClientStore';
import { AuthStorage } from './src/utils/AsyncStore';

LogBox.ignoreAllLogs();
const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ModalStack = createStackNavigator();

export default () => {
  const scheme = useColorScheme();
  const [connecting, setConnecting] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  // For actionsheets
  const [activeMessage, setActiveMessage] = useState(null);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authData = await AuthStorage.getAuthData();

        if (authData.isLoggedIn && authData.userId && authData.token) {
          console.log('Found existing auth data for user:', authData.userId);
          await initializeChatClient(authData);
          setIsAuthenticated(true);
        } else {
          console.log('No existing auth data found');
          setConnecting(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setConnecting(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Initialize chat client with auth data
  const initializeChatClient = async (authData) => {
    try {
      const chatClient = ChatClientStore.client;

      await chatClient.connectUser(
        {
          id: authData.userId,
          name: authData.userData?.name || authData.userId,
          image: authData.userData?.image,
        },
        authData.token,
      );

      setCurrentUser({
        id: authData.userId,
        token: authData.token,
        userData: authData.userData,
      });

      setConnecting(false);
      console.log('Chat client initialized successfully');
    } catch (error) {
      console.error('Error initializing chat client:', error);
      // Clear invalid auth data
      await AuthStorage.clearAuthData();
      setIsAuthenticated(false);
      setConnecting(false);
    }
  };

  // Handle successful authentication
  const handleAuthenticated = async (authData) => {
    try {
      setConnecting(true);
      await initializeChatClient(authData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication initialization error:', error);
      Alert.alert('Error', 'Failed to initialize chat. Please try again.');
      setConnecting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const chatClient = ChatClientStore.client;
      await chatClient.disconnectUser();
      await AuthStorage.clearAuthData();
      setIsAuthenticated(false);
      setCurrentUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (connecting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color='black' size='large' />
        </View>
      </SafeAreaView>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
          <SimpleLoginScreen onAuthenticated={handleAuthenticated} />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <View style={styles.container}>
          <SlackAppContext.Provider
            value={{
              activeChannel,
              activeMessage,
              setActiveChannel,
              setActiveMessage,
              logout: handleLogout, // Add logout function
              switchUser: (userId) => {
                // Simplified user switching - just log current user out
                handleLogout();
              },
            }}>
            <RootNavigation />
          </SlackAppContext.Provider>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const ModalStackNavigator = () => (
  <ModalStack.Navigator>
    <ModalStack.Screen
      component={ChannelSearchScreen}
      name='ChannelSearchScreen'
      options={{ headerShown: false }}
    />
    <ModalStack.Screen
      component={JumpToSearchScreen}
      name='JumpToSearchScreen'
      options={{ headerShown: false }}
    />
    <ModalStack.Screen
      component={NewMessageScreen}
      name='NewMessageScreen'
      options={{ headerShown: false }}
    />
    <ModalStack.Screen
      component={ShareMessageScreen}
      name='ShareMessageScreen'
      options={{ headerShown: false }}
    />
  </ModalStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator initialRouteName='ChannelListScreen'>
    <HomeStack.Screen
      component={ChannelListScreen}
      name='ChannelListScreen'
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      component={ChannelScreen}
      name='ChannelScreen'
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      component={ThreadScreen}
      name='ThreadScreen'
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);

const TabNavigation = () => (
  <BottomSheetModalProvider>
    <Tab.Navigator tabBar={(props) => <BottomTabs {...props} />}>
      <Tab.Screen component={HomeStackNavigator} name='home' />
      <Tab.Screen component={DirectMessagesScreen} name={'dms'} />
      {/* <Tab.Screen component={MentionsScreen} name={'mentions'} /> */}
      {/* <Tab.Screen component={MessageSearchScreen} name={'search'} /> */}
      <Tab.Screen component={ProfileScreen} name={'you'} />
    </Tab.Navigator>
  </BottomSheetModalProvider>
);

const RootNavigation = () => {
  const chatStyles = useStreamChatTheme();
  const { bottom, top } = useSafeAreaInsets();

  return (
    <OverlayProvider bottomInset={bottom + HEADER_HEIGHT} topInset={top}>
      <Chat client={ChatClientStore.client} style={chatStyles}>
        <RootStack.Navigator mode='modal'>
          <RootStack.Screen
            component={TabNavigation}
            name='Tabs'
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            component={ModalStackNavigator}
            name={'Modals'}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </Chat>
    </OverlayProvider>
  );
};

const styles = StyleSheet.create({
  channelScreenContainer: { flexDirection: 'column', height: '100%' },
  channelScreenSaveAreaView: {
    backgroundColor: 'white',
  },
  chatContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    flexShrink: 1,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  drawerNavigator: {
    backgroundColor: '#3F0E40',
    width: 350,
  },
  loadingContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
});
