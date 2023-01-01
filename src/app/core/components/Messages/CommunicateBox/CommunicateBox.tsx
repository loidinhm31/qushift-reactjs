import classes from "./CommunicateBox.module.css";

import React, {useCallback, useEffect, useState} from "react";
import {environment} from "../../../../environments/environment";
import {Message, retrieveMessages} from "../../../util/api";
import {useParams} from "react-router-dom";

export const CommunicateBox = () => {
    let {id} = useParams(); // topic id

    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    let eventSource: EventSource;


    listenMessageStream(id);

    const streamMessage = useCallback((tailMessage: Message) => {
        messages.push(tailMessage);
        setMessages([...messages]);
    }, [messages]);

    useEffect(() => {
        retrieveMessages(id)
            .then((data) => {
                setMessages(data);
                setIsLoading(false);
            });

        return () => eventSource.close();
    }, [id, streamMessage]);

    function listenMessageStream(id: string | undefined) {
        const url = `${environment.apiBaseUrl}/messages/stream?topicId=${id}`;

        eventSource = new EventSource(url);

        let tailMessage: Message;

        eventSource.onopen = (event: any) => console.log("open", event);
        eventSource.onmessage = (event: any) => {
            tailMessage = JSON.parse(event.data);

            if (!messages.some((msg: Message) => msg.id === tailMessage.id)) {
                streamMessage(tailMessage);
            }

        }
        eventSource.onerror = (event: any) => {
            console.log("error", event);
            if (event.readyState === EventSource.CLOSED) {
                eventSource.close();
            }
        };
    }

    return (
        <>
            <div className={classes.chatHistory}>
                {isLoading &&
                    <p>Loading...</p>
                }

                <ul className="m-2">
                    <li>
                        <div className="d-flex flex-row-reverse">
                            <div className="col-8">
                                <div className="text-end">
                                    <span className="fs-6">
                                        10:10 AM, Today
                                    </span>
                                    {/*<img src="https://bootdey.com/img/Content/avatar/avatar7.png"*/}
                                    {/*     alt="avatar"/>*/}
                                </div>
                                <div className="card">
                                    <div className="card-body rounded bg-info text-white"> Hi Aiden,
                                        how are
                                        you? How is the project coming along?
                                    </div>
                                </div>

                            </div>
                        </div>
                    </li>


                    {messages.map((message: Message, index) =>

                        <li key={index}>
                            <div className="d-flex flex-row">
                                <div className="col-8">
                                    <div className="text-start">
                                        <span className="fs-6">
                                            {message.createdAt}
                                        </span>
                                    </div>
                                    <div className={`${classes.other} card`}>
                                        <div className="card-body rounded bg-subtle">
                                            {message.content}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>


        </>
    )
}
export default CommunicateBox;