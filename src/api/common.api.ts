import { AxiosInstance } from 'axios';
import { FreshBaseResponse } from '../types/common';

export const get = async (axiosInstance: AxiosInstance, path: string, page = 1, data?: any[]): Promise<any[]> => {
  let responseData = data ? data : [];
  const response = (
    await axiosInstance.get(path, {
      params: {
        page: page,
        per_page: 1000,
      },
    })
  ).data as FreshBaseResponse;

  responseData.push(response);

  const current = response.meta?.current || response.meta?.current_page || response.pagination?.current_page;
  const total = response.meta?.total_pages || response.pagination?.total_pages;

  if (current === total) {
    return responseData;
  } else {
    return await get(axiosInstance, path, page + 1, responseData);
  }
};

export const post = async (axiosInstance: AxiosInstance, path: string, body: Object): Promise<any> => {
  try {
    const response = (await axiosInstance.post(path, body, { timeout: 999999 })).data;
    return response;
  } catch (error) {
    console.error('post error', error.toString());
  }
};
