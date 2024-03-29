import { FivetranRequest, FivetranResponse } from '../types/fivetran';
import { getAllCallMetrics, getAllCalls, getAllTeams, getAllUsers } from '../api/fresh.caller.api';
import { createMD5Hash } from '../common/hash';
import { has, chunk } from 'lodash';

const CHUNK_SIZE = 500;

const eventHasStateParams = (event: FivetranRequest) =>
  has(event, 'state.currentHash') &&
  has(event, 'state.calls_chunkNumber') &&
  has(event, 'state.callMetrics_chunkNumber');

export const freshCallerHandler = async (event: FivetranRequest, context, callback) => {
  console.log(JSON.stringify(event));

  if (has(event, 'setup_test')) {
    callback(null, true);
    return;
  }

  let stateHash = '';
  let usersHash = '';
  let teamsHash = '';
  let calls_chunkNumber = 0;
  let callMetrics_chunkNumber = 0;

  if (eventHasStateParams(event)) {
    stateHash = event.state['currentHash'] as string;
    usersHash = event.state['usersHash'] as string;
    teamsHash = event.state['teamsHash'] as string;
    calls_chunkNumber = parseInt(event.state['calls_chunkNumber'] as string) + 1;
    callMetrics_chunkNumber = parseInt(event.state['callMetrics_chunkNumber'] as string) + 1;
  }

  console.log(
    `freshCallerHandler [calls_chunkNumber=${calls_chunkNumber}, callMetrics_chunkNumber=${callMetrics_chunkNumber}, usersHash=${stateHash}]`
  );

  const calls = chunk(await getAllCalls(), CHUNK_SIZE);
  const callsChunks = calls.length;
  console.log(`calls [callsChunks=${callsChunks}, dataSize=${CHUNK_SIZE * callsChunks}]`);

  const teams = await getAllTeams();
  const teamsDataHash = createMD5Hash(JSON.stringify(teams));
  console.log(`teams [count=${teams.length}]`);

  const users = await getAllUsers();
  const usersDataHash = createMD5Hash(JSON.stringify(users));
  console.log(`users [count=${users.length}]`);

  const callMetrics = chunk(await getAllCallMetrics(), CHUNK_SIZE);
  const callMetricsChunks = callMetrics.length;
  console.log(`callMetrics [callMetricsChunks=${callMetricsChunks}, dataSize=${CHUNK_SIZE * callMetricsChunks}]`);

  const insertObject = {
    freshcaller_calls: calls_chunkNumber < callsChunks ? calls[calls_chunkNumber] : [],
    freshcaller_teams: teamsDataHash != teamsHash ? teams : [],
    freshcaller_users: usersDataHash != usersHash ? users : [],
    freshcaller_callmetrics: callMetrics_chunkNumber < callMetricsChunks ? callMetrics[callMetrics_chunkNumber] : [],
  };

  const dataHash = createMD5Hash(JSON.stringify(insertObject));

  const resp: FivetranResponse = {
    insert: insertObject,
    state: {
      currentHash: dataHash,
      calls_chunkNumber,
      callMetrics_chunkNumber,
      usersHash: usersDataHash,
      teamsHash: teamsDataHash,
    },
    hasMore: dataHash != stateHash,
  };
  callback(null, resp);
};
