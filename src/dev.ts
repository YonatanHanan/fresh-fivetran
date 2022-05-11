import { freshCallerHandler } from './handlers/freshcaller';
import { freshChatHandler } from './handlers/freshchat';
require('dotenv').config();

(async () => {
  // await freshChatHandler(
  //   {
  //     secrets: {
  //       consumerKey: '',
  //       consumerSecret: '',
  //       apiKey: 'yourApiKey',
  //     },
  //     agent: 'Fivetran AWS Lambda Connector/fivetran/aws_lambda',
  //     setup_test: false,
  //   },
  //   {},
  //   () => {}
  // );

  await freshCallerHandler(
    {
      state: {
        currentHash: 'f528d02bf5df985bbed5f082ba2ad3ab',
        calls_chunkNumber: 13,
        callMetrics_chunkNumber: 13,
        usersHash: 'f2e7951a502fccc07785d16b946dc079',
        teamsHash: '6cff286bb3f8c56c9fa2c03a5b1acfb5',
      },
      secrets: {
        consumerKey: '',
        consumerSecret: '',
        apiKey: 'yourApiKey',
      },
      agent: 'Fivetran AWS Lambda Connector/rocket_durable/freshcaller',
    },
    {},
    () => {}
  );

  console.log('asd');
})();
