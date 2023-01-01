import {environment} from "../../environments/environment";

export interface Message {
    createdAt: string,
    id: string,
    sender: string,
    receiver: string,
    content: string,
    channelId: string
}

export async function retrieveTopics() {
    const response = await fetch(`${environment.apiBaseUrl}/topics?memberId=abc&start=0&size=5`);
    if (!response.ok) {
        throw new Response('Failed to fetch topics.', {status: 500});
    }
    return response.json();
}

export async function retrieveMessages(id: string | undefined) {
    const response = await fetch(`${environment.apiBaseUrl}/messages?topicId=${id}&start=0&size=5`);
    if (!response.ok) {
        console.log("hit")

        throw new Response('Failed to fetch messages.', {status: 500});
    }
    return response.json();
}