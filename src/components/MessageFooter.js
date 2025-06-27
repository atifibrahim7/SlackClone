import { useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useMessageContext } from 'stream-chat-react-native';

import { SlackReactionList } from './SlackReactionList/SlackReactionList';

const styles = StyleSheet.create({
  reactionListContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginTop: 5,
  },
  reactionPickerContainer: {
    borderRadius: 10,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 6,
  },
});

const MessageFooterWithContext = React.memo((props) => {
  const {
    goToMessage,
    message,
    openReactionPicker: propOpenReactionPicker,
  } = props;

  const { colors } = useTheme();
  const messageId = message?.id;

  const openReactionPicker = useCallback(() => {
    propOpenReactionPicker(message);
  }, [messageId]);

  return (
    <View style={styles.reactionListContainer}>
      <SlackReactionList openReactionPicker={openReactionPicker} />
    </View>
  );
});

export const MessageFooter = (props) => {
  const { goToMessage, openReactionPicker } = props;

  const { message } = useMessageContext();

  return (
    <MessageFooterWithContext
      goToMessage={goToMessage}
      message={message}
      openReactionPicker={openReactionPicker}
    />
  );
};
