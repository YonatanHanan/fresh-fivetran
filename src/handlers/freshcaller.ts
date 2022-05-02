import { FivetranRequest, FivetranResponse } from '../types/fivetran';
import { getAllCallMetrics, getAllCalls, getAllTeams, getAllUsers } from '../api/fresh.caller.api';

export const freshCallerHandler = async (event: FivetranRequest, context, callback) => {
  // fetch the data

  console.log((await getAllCalls()).length);
  console.log((await getAllTeams()).length);
  console.log((await getAllUsers()).length);
  console.log((await getAllCallMetrics()).length);

  const resp: FivetranResponse = {
    hasMore: false,
  };
  callback(null, resp);
};
