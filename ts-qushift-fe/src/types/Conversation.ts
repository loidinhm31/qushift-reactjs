export interface Message {
  id?: string;
  sender: string;
  receiver: string;
  content: string;
  topicId: string;
  createdAt?: string;
}

export interface Topic {
  id?: string;
  originId?: string;
  isNew: boolean;
  name: string;
  members?: Member[];
}

export interface Member {
  userId: string;
  username: string;
  checkSeen?: boolean;
  notSeenCount?: number;
}

export interface CommunicateProp {
  user: User;
  topic?: Topic;
  sendSignal: boolean;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}
