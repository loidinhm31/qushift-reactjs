export interface TopicInterface {
    id: string;
    name: string;
    members?: MemberInterface[];
}

export interface MemberInterface {
    user: string;
    checkSeen: boolean;
    notSeenCount: number;
}

export interface CommunicatePropInterface {
    topicId: string;
    checkSeen: boolean;
}