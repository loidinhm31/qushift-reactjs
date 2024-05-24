import axios from "axios";
import process from "process";

import { useEventStream, useEventStreamBreakState } from "@/hooks/eventstream/useEventStream";
import { Member, Message, Topic } from "@/types/Conversation";
import { DefaultUser } from "@/types/DefaultUser";

export const getTopicsApi = async (user: DefaultUser | null) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/topics?start=0&size=20&userId=root`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
};

export const getTopicApi = async (topicId: string, user: DefaultUser | null) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/topics/${topicId}?userId=${user?.id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
};

export const createTopicApi = async (payload: Topic, user: DefaultUser | null) => {
  return await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/topics`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
};

export const makeSignalApi = async (payload: any) => {
  return await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/messages/signals`, payload);
};

export const useStreamTopicApi = (user: DefaultUser | null) => {
  return useEventStream<Topic>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/topics/stream?receiverId=root`, user);
};

export const useStreamMessageApi = (topicId: string, user: DefaultUser | null) => {
  return useEventStreamBreakState<Message>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/messages/stream?topicId=${topicId}`,
    user,
  );
};

export const fetchMessagesApi = async (currPage: number, topicId: string, user: DefaultUser | null) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/messages?topicId=${topicId}&start=${currPage}&size=15&userId=${user?.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    },
  );
};

export const makeMessageApi = async (payload: Message, user: DefaultUser | null) => {
  return await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/messages`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
};

export const addMembersApi = async (payload: Member[], topicId: string, user: DefaultUser | null) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/topics/${topicId}/members`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
};
