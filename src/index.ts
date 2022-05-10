import { freshCallerHandler } from './handlers/freshcaller';
import { freshChatHandler } from './handlers/freshchat';

module.exports = {
  getFreshcaller: async (event, context, callback) => {
    return await freshCallerHandler(event, context, callback);
  },
  getFreshchat: async (event, context, callback) => {
    return await freshChatHandler(event, context, callback);
  },
};
