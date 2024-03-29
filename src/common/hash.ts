import * as crypto from 'crypto';

export const createMD5Hash = (data) => {
  const buf = Buffer.from(data);
  const hashed = crypto.createHash('md5').update(buf).digest('hex');
  return hashed;
};
