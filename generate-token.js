const { StreamChat } = require('stream-chat');

const apiKey = 'k6hxvzk6de5j';
const apiSecret = '97amnchq3s8brfutvkexqgjk6td3zz9yygxbb7uub6jx7a2kmdw9xj8qnpk8fxvn';
const userId = 'Atif';

const serverClient = StreamChat.getInstance(apiKey, apiSecret);
const token = serverClient.createToken(userId);

console.log('Generated Token:', token);