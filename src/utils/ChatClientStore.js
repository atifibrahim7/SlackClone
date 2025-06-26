import { API_KEY } from 'react-native-dotenv';
import { StreamChat } from 'stream-chat';

export const ChatClientStore = {
  get client() {
    // Use API_KEY from env, fallback to a default for development
    const apiKey = API_KEY || 'k6hxvzk6de5j';
    return StreamChat.getInstance(apiKey, {
      timeout: 10000,
    });
  },
};
