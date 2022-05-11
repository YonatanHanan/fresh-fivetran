import { FivetranRequest, FivetranResponse } from '../types/fivetran';
import { getAllCallMetrics, getAllCalls, getAllTeams, getAllUsers } from '../api/fresh.caller.api';
import { base64AndMD5 } from '../common/hash';
import { has, chunk } from 'lodash';

export const freshCallerHandler = async (event: FivetranRequest, context, callback) => {
  console.log(JSON.stringify(event));

  if (has(event, 'setup_test')) {
    callback(null, true);
    return;
  }

  let stateHash = '';
  let chunkNumber = 0;

  if (has(event, 'state.currentHash') && has(event, 'state.chunkNumber')) {
    stateHash = event.state['currentHash'];
    chunkNumber = parseInt(event.state['chunkNumber']) + 1;
  }

  console.log(`freshCallerHandler [chunkNumber=${chunkNumber}, stateHash=${stateHash}]`);

  const calls = chunk(await getAllCalls(), 500)[chunkNumber];
  console.log(`calls [count=${calls.length}]`);

  const teams = await getAllTeams();
  console.log(`teams [count=${teams.length}]`);

  const users = await getAllUsers();
  console.log(`users [count=${users.length}]`);

  const callMetrics = chunk(await getAllCallMetrics(), 500)[chunkNumber];
  console.log(`callMetrics [count=${callMetrics.length}]`);

  const insertObject = {
    freshcaller_calls: calls,
    freshcaller_teams: teams,
    freshcaller_users: users,
    freshcaller_callmetrics: callMetrics,
  };

  const dataHash = base64AndMD5(JSON.stringify(insertObject));

  const resp: FivetranResponse = {
    insert: insertObject,
    state: {
      currentHash: dataHash,
      chunkNumber,
    },
    hasMore: dataHash != stateHash,
  };
  callback(null, resp);
};
