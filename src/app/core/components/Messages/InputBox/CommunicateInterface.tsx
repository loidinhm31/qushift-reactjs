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
    userId: string;
    topicId: string;
    sendSignal: boolean;
}