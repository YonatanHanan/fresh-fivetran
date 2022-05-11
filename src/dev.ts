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
      setup_test: false,
    },
    {},
    () => {}
  );
  console.log('asd');
})();
