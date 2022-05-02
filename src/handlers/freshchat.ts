import { FivetranRequest, FivetranResponse } from '../types/fivetran';

export const freshChatHandler = async (event: FivetranRequest, context, callback) => {
  // fetch the data
  const resp: FivetranResponse = {
    hasMore: false,
  };
  callback(null, resp);
};
