import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCText } from '../components/SCText';
import { SlackAppContext } from '../contexts/SlackAppContext';
import { HEADER_HEIGHT } from '../utils';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    borderRadius: 5,
    height: 35,
    marginRight: 20,
    width: 35,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
  },
});

export const ScreenHeader = ({ showLogo = false, title }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.primary,
            height: HEADER_HEIGHT + insets.top,
            paddingTop: insets.top,
          },
        ]}>
        <SCText
          style={[
            styles.title,
            {
              color: colors.textInverted,
            },
          ]}>
          {title}
        </SCText>
      </View>
    </>
  );
};
