import {
  getAllAgents,
  getAllChannels,
  getAllGroups,
  getConversations,
  getReport,
  getUsers,
  sleep,
} from '../api/fresh.chat.api';
import { FivetranRequest, FivetranResponse } from '../types/fivetran';
import { forEach, lowerCase, replace, has, map, uniq, flatten } from 'lodash';
import { ReportTypes } from '../types/freshchat';
import { addWeeks, subHours, addDays, parseISO, isYesterday } from 'date-fns';
import { createMD5Hash } from '../common/hash';

const START_DATE = new Date(2021, 2, 1);
const SCHEMA = {
  freshchat_agents: {
    primary_key: ['id'],
  },
  freshchat_channels: {
    primary_key: ['id'],
  },
  freshchat_groups: {
    primary_key: ['id'],
  },
  freshchat_report_conversation_created: {
    primary_key: ['conversation_id', 'interaction_id'],
  },
  freshchat_report_message_sent: {
    primary_key: ['interaction_id', 'conversation_id', 'channel_id'],
  },
  freshchat_report_conversation_resolved: {
    primary_key: ['agent_id', 'interaction_id', 'conversation_id', 'channel_id'],
  },
  freshchat_report_csat_score: {
    primary_key: ['agent_id', 'csat_id', 'csat_submitter_user_id', 'channel_id', 'actor_id'],
  },
  freshchat_report_conversation_resolution_label: {
    primary_key: ['agent_id', 'actor_id', 'channel_id'],
  },
  freshchat_report_agent_activity: {
    primary_key: ['agent_id'],
  },
  freshchat_report_response_time: {
    primary_key: ['agent_id', 'interaction_id', 'channel_id'],
  },
  freshchat_report_resolution_time: {
    primary_key: ['agent_id', 'interaction_id', 'conversation_id', 'actor_id', 'channel_id'],
  },
  freshchat_conversation: {
    primary_key: ['conversation_id'],
  },
  freshchat_users: {
    primary_key: ['id'],
  },
};

const ONE_MINUTE = 60 * 1000;

export const freshChatHandler = async (event: FivetranRequest, context, callback) => {
  console.log(JSON.stringify(event));

  if (has(event, 'setup_test') && event?.setup_test === true) {
    console.log(`setup test`);
    callback(null, true);
    return;
  }

  let startDate = subHours(new Date(), 1);
  let endDate = new Date();
  let stateHash = '';

  if (!has(event, 'state.fresh_start_date')) {
    startDate = START_DATE;
    endDate = addWeeks(startDate, 1);
  } else {
    await sleep(3 * ONE_MINUTE);

    startDate = parseISO(event.state['fresh_start_date'] as string);
    stateHash = event.state['currentHash'] as string;

    endDate = addDays(startDate, 3);
    if (isYesterday(startDate)) {
      endDate = new Date();
    }
  }

  console.log(`freshChatHandler [startDate=${startDate}, endDate=${endDate}]`);
  // fetch the data
  const agents = await getAllAgents();
  console.log(`agents [count=${agents.length}]`);

  const channels = await getAllChannels();
  console.log(`channels [count=${channels.length}]`);

  const groups = await getAllGroups();
  console.log(`groups [count=${groups.length}]`);

  const reports = {};
  for (let i = 0; i < ReportTypes.length; i++) {
    const report = ReportTypes[i];
    try {
      await sleep(ONE_MINUTE / 2);

      reports[report] = await getReport(startDate, endDate, report);
      console.log(`getReport [report=${report},length=${reports[report].length}]`);
    } catch (error) {
      console.error(`getReport fail [report=${report},error=${error.toString()}]`);
      callback(new Error('to many requests'), null);
      return;
    }
  }

  let insertObject = {
    freshchat_agents: agents,
    freshchat_channels: channels,
    freshchat_groups: groups,
  };

  forEach(Object.keys(reports), (reportName) => {
    const tableName = `freshchat_report_${replace(lowerCase(reportName), ' ', '_')}`;
    insertObject[tableName] = reports[reportName];
  });

  insertObject['freshchat_users'] = await getUsers(
    uniq(map(insertObject['freshchat_report_conversation_created'], (row) => row.user_id))
  );
  console.log(`freshchat_users [length=${insertObject['freshchat_users'].length}]`);

  const conversationIds = uniq(
    flatten([
      ...map(insertObject['freshchat_report_conversation_created'], (row) => row.conversation_id),
      ...map(insertObject['freshchat_report_conversation_resolved'], (row) => row.conversation_id),
      ...map(insertObject['freshchat_report_message_sent'], (row) => row.conversation_id),
      ...map(insertObject['freshchat_report_resolution_time'], (row) => row.conversation_id),
    ])
  );

  insertObject['freshchat_conversation'] = await getConversations(conversationIds);
  console.log(`freshchat_conversation [length=${insertObject['freshchat_conversation'].length}]`);

  console.log(`insertObject ${JSON.stringify(Object.keys(insertObject))}`);

  const dataHash = createMD5Hash(JSON.stringify(insertObject));

  const resp: FivetranResponse = {
    insert: insertObject,
    state: {
      fresh_start_date: endDate.toISOString(),
      currentHash: dataHash,
    },
    hasMore: dataHash != stateHash,
    schema: SCHEMA,
  };
  callback(null, resp);
};
