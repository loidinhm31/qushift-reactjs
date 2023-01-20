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
    user: UserInterface;
    topic?: TopicInterface;
    sendSignal: boolean;
}

export interface UserInterface {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
}