export interface Message {
    createdAt: string;
    id: string;
    sender: string;
    receiver: string;
    content: string;
    topicId: string;
}

export interface Topic {
    id: string;
    name: string;
    members?: Member[];
}

export interface Member {
    user: string;
    checkSeen: boolean;
    notSeenCount: number;
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