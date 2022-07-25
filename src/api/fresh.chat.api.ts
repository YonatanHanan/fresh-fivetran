import { freshChatAPI, FreshChatEndpoints } from '../common/endpoints';
import { get, post } from './common.api';
import { flatten, map } from 'lodash';
import axios from 'axios';
import * as yauzl from 'yauzl';
const csvtojson = require('csvtojson/v2');
import { formatISO } from 'date-fns';

export const getAllAgents = async () => {
  const response = await get(freshChatAPI, FreshChatEndpoints.agents);
  return flatten(map(flatten(response), (page) => page.agents));
};

export const getAllChannels = async () => {
  const response = await get(freshChatAPI, FreshChatEndpoints.channels);
  return flatten(map(flatten(response), (page) => page.channels));
};

export const getAllGroups = async () => {
  const response = await get(freshChatAPI, FreshChatEndpoints.groups);
  return flatten(map(flatten(response), (page) => page.groups));
};

export const sleep = async (ms: number) => new Promise((res) => setTimeout(res, ms));

const getReportLinks = async (reportId: string) => {
  let response = (await get(freshChatAPI, `${FreshChatEndpoints.report}/${reportId}`))[0];
  let isComplete = response.status === 'COMPLETED';

  while (!isComplete) {
    await sleep(500);
    response = (await get(freshChatAPI, `${FreshChatEndpoints.report}/${reportId}`))[0];
    isComplete = response.status === 'COMPLETED';

    if (isComplete) {
      return response.links;
    }
  }
};

export const getReport = async (startDate: Date, endDate: Date, reportType: string) => {
  const reportRequest = {
    start: formatISO(startDate),
    end: formatISO(endDate),
    event: reportType,
    format: 'csv',
  };
  const report = await post(freshChatAPI, FreshChatEndpoints.report, reportRequest);

  const links = await getReportLinks(report.id);
  const files = await Promise.all(
    map(links, (link) =>
      axios.get(link.link.href, {
        responseType: 'arraybuffer',
      })
    )
  );

  let data = await Promise.all(
    map(files, async (file, i) => {
      return new Promise((res) => {
        yauzl.fromBuffer(file.data, { lazyEntries: true }, async (err, zipfile) => {
          if (err) throw err;
          zipfile.readEntry();

          zipfile.on('entry', async function (entry) {
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
            } else {
              zipfile.openReadStream(entry, async function (err, readStream) {
                if (err) throw err;
                readStream.on('end', function () {
                  zipfile.readEntry();
                });

                csvtojson()
                  .fromStream(readStream)
                  .then((data) => {
                    res(data);
                  });
              });
            }
          });
        });
      });
    })
  );

  return flatten(data);
};

export const getUser = async (userId) => {
  const response = await get(freshChatAPI, `${FreshChatEndpoints.users}/${userId}`);
  return response[0];
};

export const getUsers = async (usersIds: string[]) => {
  return await Promise.all(
    map(usersIds, async (userId) => {
      return await getUser(userId);
    })
  );
};

export const getConversation = async (conversationId) => {
  const response = await get(freshChatAPI, `${FreshChatEndpoints.conversation}/${conversationId}`);
  const messages = await get(freshChatAPI, `${FreshChatEndpoints.conversation}/${conversationId}/messages`);
  return { conversation: response[0], messages: messages[0].messages };
};

export const getConversations = async (conversationIds: string[]) => {
  return await Promise.all(
    map(conversationIds, async (conversationId) => {
      return await getConversation(conversationId);
    })
  );
};
