import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, StyleSheet, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { SCText } from '../components/SCText';
import { SVGIcon } from '../components/SVGIcon';
import { SlackAppContext } from '../contexts/SlackAppContext';
import { notImplemented } from '../utils';
import { ChatClientStore } from '../utils/ChatClientStore';
import { ScreenHeader } from './ScreenHeader';

const styles = StyleSheet.create({
  actionItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  actionItemSection: {},
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  status: {
    fontSize: 12,
    fontWeight: '400',
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    padding: 8,
    paddingLeft: 20,
  },
  userImage: {
    borderRadius: 7,
    height: 60,
    width: 60,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const chatClient = ChatClientStore.client;

/** @todo: Cleanup styling */
export const ProfileScreen = () => {
  const { colors } = useTheme();
  const { logout } = useContext(SlackAppContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}>
      <View style={{ flex: 1 }}>
        <ScreenHeader title='You' />
        <View style={styles.container}>
          <View style={styles.row}>
            <View>
              <Image
                source={{
                  uri: chatClient.user.image,
                }}
                style={styles.userImage}
              />
            </View>
            <View style={styles.userDetails}>
              <SCText style={styles.userName}>
                {chatClient.user.name} {chatClient.user.status}
              </SCText>
              <SCText style={styles.status}>Active</SCText>
            </View>
          </View>
          <TouchableOpacity
            onPress={notImplemented}
            style={[
              {
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 20,
                padding: 13,
                paddingLeft: 20,
              },
              {
                borderColor: colors.border,
              },
            ]}>
            <SCText style={{ fontSize: 14 }}>Whats your status</SCText>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 30,
            }}>
           
            <View
              style={[
                styles.actionItemSection,
                {
                  borderTopColor: colors.border,
                  borderTopWidth: 0.5,
                  marginTop: 20,
                },
              ]}>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'view-profile'} width='23' />
                <SCText style={{ paddingLeft: 20, color: '#FF3B30' }}>
                  {'Logout'}
                </SCText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
