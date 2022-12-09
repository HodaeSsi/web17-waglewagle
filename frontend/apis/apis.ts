import {
  AddKeywordData,
  CommunityData,
  JoinKeywordData,
  KeywordData,
  KeywordRelatedData,
  KeywordUser,
  MyKeywordData,
  ThreadData,
  UserData,
} from '#types/types';
import axios from 'axios';
import config from '../config';

const apiInstance = axios.create({
  baseURL: `${config.API_HOST}`,
});

const fetchLogin = async (username: string) => {
  const response = await apiInstance.post('/v1/user/login', {
    data: username,
  });

  return response;
};

const getKeywords = async (id: string): Promise<KeywordData[]> => {
  const response = await apiInstance.get(`/v1/keyword/${id}`);

  return response.data;
};

const getUserCommunityList = async (): Promise<CommunityData[]> => {
  const response = await apiInstance.get('/v1/community');

  return response.data;
};

const joinCommunity = async (communityId: string) => {
  await apiInstance.post('/v1/community-user', {
    communityId,
  });
};

const updateFirstVisitInCommunity = async (communityId: string) => {
  await apiInstance.put(`/v1/community-user/${communityId}/first-visit`);
};

// isFirstInCommunity가 없으면 isFirstLogin이 항상 null
const getUserData = async (communityId?: string): Promise<UserData> => {
  const response = await apiInstance.get('/v1/user/me', {
    params: {
      'community-id': communityId,
    },
  });

  return response.data;
};

const getKeywordAssociations = async (
  id: string,
): Promise<KeywordRelatedData[]> => {
  const response = await apiInstance.get('/v1/keyword/associations', {
    params: {
      'keyword-id': id,
    },
  });

  return response.data;
};

const addKeyword = async (
  addKeywordData: AddKeywordData,
): Promise<MyKeywordData> => {
  const response = await apiInstance.post('/v1/keyword', addKeywordData);

  return response.data;
};

const joinKeyword = async (joinKeywordData: JoinKeywordData) => {
  await apiInstance.post('/v1/keyword/join', joinKeywordData);
};

const disjoinKeyword = async (disjoinKeywordData: JoinKeywordData) => {
  await apiInstance.delete('/v1/keyword/disjoin', {
    data: disjoinKeywordData,
  });
};

const getKeywordThreads = async (keywordId: string): Promise<ThreadData[]> => {
  const response = await apiInstance.get(
    `/v1/thread/keyword?keyword-id=${keywordId}`,
  );

  return response.data;
};

const getKeywordUsers = async (keywordId: string): Promise<KeywordUser[]> => {
  const response = await apiInstance.get(
    `/v1/user/keyword?keyword-id=${keywordId}`,
  );

  return response.data;
};

const addThread = async (keywordId: string, content: string) => {
  const response = await apiInstance.post('/v1/thread', {
    keywordId,
    content,
  });

  return response.data;
};

const addComments = async (
  keywordId: string,
  content: string,
  parentThreadId: string,
) => {
  const response = await apiInstance.post('/v1/thread', {
    keywordId,
    content,
    parentThreadId,
  });

  return response.data;
};

const deleteThread = async (threadId: string) => {
  const response = await apiInstance.delete('/v1/thread', {
    data: { threadId },
  });

  return response.data;
};

const deleteKeyword = async (communityId: string, keywordIdList: string[]) => {
  const response = await apiInstance.delete('/v1/keyword', {
    data: {
      communityId,
      keywordIdList,
    },
  });

  return response.data;
};

const mergeKeyword = async (
  communityId: string,
  destinationKeywordId: string,
  sourceKeywordIdList: string[],
) => {
  const response = await apiInstance.put('/v1/keyword/merge', {
    communityId,
    destinationKeywordId,
    sourceKeywordIdList,
  });

  return response.data;
};

const getMyKeywordList = async (
  communityId: string,
): Promise<MyKeywordData[]> => {
  const response = await apiInstance.get(`/v1/keyword/user/${communityId}`);

  return response.data;
};

const apis = {
  fetchLogin,
  getKeywords,
  joinKeyword,
  disjoinKeyword,
  getUserCommunityList,
  joinCommunity,
  updateFirstVisitInCommunity,
  addKeyword,
  getUserData,
  getKeywordAssociations,
  getKeywordThreads,
  getKeywordUsers,
  addThread,
  addComments,
  deleteThread,
  deleteKeyword,
  mergeKeyword,
  getMyKeywordList,
};

export default apis;