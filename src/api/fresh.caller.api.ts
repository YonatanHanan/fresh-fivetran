import { freshCallerAPI, FreshCallerEndpoints } from '../common/endpoints';
import { get } from './common.api';
import { flatten, map } from 'lodash';

export const getAllTeams = async () => {
  const response = await get(freshCallerAPI, FreshCallerEndpoints.teams);
  return flatten(map(flatten(response), (page) => page.teams));
};

export const getAllUsers = async () => {
  const response = await get(freshCallerAPI, FreshCallerEndpoints.users);
  return flatten(map(flatten(response), (page) => page.users));
};

export const getAllCalls = async () => {
  const response = await get(freshCallerAPI, FreshCallerEndpoints.calls);
  return flatten(map(flatten(response), (page) => page.calls));
};

export const getAllCallMetrics = async () => {
  const response = await get(freshCallerAPI, FreshCallerEndpoints.callMetrics);
  return flatten(map(flatten(response), (page) => page.call_metrics));
};
