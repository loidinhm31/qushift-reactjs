import {environment} from "../../environments/environment";

export interface Message {
    createdAt: string;
    id: string;
    sender: string;
    receiver: string;
    content: string;
    topicId: string;
}

export type InputMessage = {
    sender: string;
    receiver: string;
    content: string;
    topicId?: string;
}

export async function retrieveTopics() {
    const response = await fetch(`${environment.apiBaseUrl}/topics?userId=test-a&start=0&size=5`);
    if (!response.ok) {
        throw new Response('Failed to fetch topics.', {status: 500});
    }
    return response.json();
}

export async function retrieveMessages(id: string | undefined) {
    const response = await fetch(`${environment.apiBaseUrl}/messages?topicId=${id}&start=0&size=10`);
    if (!response.ok) {
        throw new Response('Failed to fetch messages.', {status: 500});
    }
    return response.json();
}

export async function sendMessage(inputMessage: InputMessage) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(inputMessage),
    }

    const response = await fetch(`${environment.apiBaseUrl}/messages`, requestOptions);
    if (!response.ok) {
        throw new Response('Failed to post message.', {status: 500});
    }
}