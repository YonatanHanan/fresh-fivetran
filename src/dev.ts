import { getAllAgents, getAllChannels, getAllGroups, getReport } from './api/fresh.chat.api';
import { ReportTypes } from './types/freshchat';
import { map } from 'lodash';
require('dotenv').config();

(async () => {
  const agents = await getAllAgents();
  const groups = await getAllGroups();
  const channels = await getAllChannels();

  await Promise.all(map(ReportTypes, (report) => getReport(new Date(2022, 3, 25), new Date(), report)));
  console.log('asd');
})();
