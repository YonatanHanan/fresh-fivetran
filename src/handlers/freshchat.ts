import { getAllAgents, getAllChannels, getAllGroups, getReport, sleep } from '../api/fresh.chat.api';
import { FivetranRequest, FivetranResponse } from '../types/fivetran';
import { forEach, lowerCase, replace, has } from 'lodash';
import { ReportTypes } from '../types/freshchat';
import { addWeeks, subHours, addHours, parseISO } from 'date-fns';
import { base64AndMD5 } from '../common/hash';

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
};

const ONE_MINUTE = 60 * 1000;
export const freshChatHandler = async (event: FivetranRequest, context, callback) => {
  await sleep(3 * ONE_MINUTE);

  console.log(JSON.stringify(event));

  if (has(event, 'setup_test') || event?.setup_test === true) {
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
    startDate = parseISO(event.state['fresh_start_date']);
    stateHash = event.state['currentHash'];
    endDate = addHours(startDate, 24);
  }

  console.log(`freshChatHandler [startDate=${startDate}, endDate=${addWeeks(startDate, 1)}]`);
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
      await sleep(5000);

      reports[report] = await getReport(startDate, addWeeks(startDate, 1), report);
      console.log(`getReport [report=${report},length=${reports[report].length}]`);
    } catch (error) {
      console.error(`getReport fail [report=${report},error=${error.toString()}]`);
      callback(new Error('to many requests'), null);
      return;
    }
  }
  console.log(`reports ${JSON.stringify(Object.keys(reports))}`);

  let insertObject = {
    freshchat_agents: agents,
    freshchat_channels: channels,
    freshchat_groups: groups,
  };

  forEach(Object.keys(reports), (reportName) => {
    const tableName = `freshchat_report_${replace(lowerCase(reportName), ' ', '_')}`;
    insertObject[tableName] = reports[reportName];
  });

  const dataHash = base64AndMD5(JSON.stringify(insertObject));

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
