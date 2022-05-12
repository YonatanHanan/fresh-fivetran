import axios from 'axios';
import { FRESH_CALLER_API_KEY, FRESH_CHAT_API_KEY } from './config';

export enum FreshCallerEndpoints {
  baseURL = 'https://fibotax.freshcaller.com',
  users = '/api/v1/users',
  teams = '/api/v1/teams',
  calls = '/api/v1/calls',
  callMetrics = '/api/v1/call_metrics',
}

export enum FreshChatEndpoints {
  baseURL = 'https://api.freshchat.com',
  agents = '/v2/agents',
  channels = '/v2/channels',
  groups = '/v2/groups',
  report = '/v2/reports/raw',
  users = '/v2/users',
}

export const freshCallerAPI = axios.create({
  baseURL: FreshCallerEndpoints.baseURL,
  headers: {
    'X-Api-Auth': FRESH_CALLER_API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const freshChatAPI = axios.create({
  baseURL: FreshChatEndpoints.baseURL,
  headers: {
    Authorization: `Bearer ${FRESH_CHAT_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
