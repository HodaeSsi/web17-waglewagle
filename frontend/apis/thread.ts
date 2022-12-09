import { ThreadData } from '#types/types';
import { apiInstance } from '@apis/apis';
import { instance } from '@apis/instance';
import type { AxiosResponse } from 'axios';

const getKeywordThreads = (
  keywordId: string,
): Promise<AxiosResponse<ThreadData[]>> =>
  apiInstance.get(`/v1/thread/keyword?keyword-id=${keywordId}`);

type AddThreadRequestBody = {
  keywordId: string;
  content: string;
};

const addThread = (
  addThreadRequestParam: AddThreadRequestBody,
): Promise<AxiosResponse<ThreadData>> =>
  instance.post('/v1/thread', addThreadRequestParam);

type AddCommentsRequestBody = {
  keywordId: string;
  content: string;
  parentThreadId: string;
};

const addComments = (
  addCommentsRequestParam: AddCommentsRequestBody,
): Promise<AxiosResponse<ThreadData>> =>
  instance.post('/v1/thread', addCommentsRequestParam);

type DeleteThreadRequestBody = {
  threadId: string;
};

const deleteThread = (
  deleteThreadRequestParam: DeleteThreadRequestBody,
): Promise<AxiosResponse<ThreadData>> =>
  instance.delete('/v1/thread', {
    data: deleteThreadRequestParam,
  });

export const thread = {
  getKeywordThreads,
  addThread,
  addComments,
  deleteThread,
};
