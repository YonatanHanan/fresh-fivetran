import { getAllAgents, getAllChannels, getAllGroups, getReport } from './api/fresh.chat.api';
import { ReportTypes } from './types/freshchat';
import { map } from 'lodash';
import { freshChatHandler } from './handlers/freshchat';
require('dotenv').config();

(async () => {
  await freshChatHandler(
    {
      secrets: {
        consumerKey: '',
        consumerSecret: '',
        apiKey: 'yourApiKey',
      },
      agent: 'Fivetran AWS Lambda Connector/fivetran/aws_lambda',
      setup_test: true,
    },
    {},
    () => {}
  );
  console.log('asd');
})();
