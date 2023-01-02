import classes from "./CommunicateBox.module.css";

import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {environment} from "../../../../environments/environment";
import {Message, retrieveMessages} from "../../../util/api";
import {CommunicateCtx} from "../Communicate";

export const CommunicateBox = () => {
    const {communicateProps, setCommunicateProps} = useContext(CommunicateCtx);

    const [isLoading, setIsLoading] = useState(true);
    let [messages, setMessages] = useState<Message[]>([]);

    const boxEndRef = useRef<HTMLDivElement | null>(null);

    // Clear messages when topic id change
    useEffect(() => {
        console.log("Changed id to " + communicateProps.topicId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        messages = [];
        setMessages(messages);
    }, [communicateProps.topicId])

    // Get history messages
    useEffect(() => {
        console.log(`Getting history for id ${communicateProps.topicId}...`);
        retrieveMessages(communicateProps.topicId)
            .then((data) => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                messages = data;
                setMessages(messages);
                setIsLoading(false);
            })
            .finally(() => scrollToBottom())
            .catch((err) => console.log(err));
    }, [communicateProps.topicId]);

    // Callback for listening the incoming message
    const streamMessage = useCallback((tailMessage: Message) => {
        console.log(`Updating stream for id ${communicateProps.topicId}...`);

        messages.push(tailMessage);
        setMessages([...messages]);

        scrollToBottom();
    }, [communicateProps.topicId, messages]);

    // Control event source to work with SSE for the incoming message
    useEffect(() => {
        if (communicateProps.topicId !== "") {
            console.log(`Opening stream for id ${communicateProps.topicId}...`)

            const url = `${environment.apiBaseUrl}/messages/stream?topicId=${communicateProps.topicId}`;

            const eventSource = new EventSource(url);

            eventSource.onopen = (event: any) => console.log("open", event);

            eventSource.onmessage = (event: any) => {
                const tailMessage = JSON.parse(event.data);

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

            return () => {
                console.log(`Closing stream for id ${communicateProps.topicId}...`);
                eventSource.close();
            };
        }
    }, [communicateProps.topicId])

    const setHoverChat = () => {
        setCommunicateProps((prop: any) => ({
            ...prop,
            sendSignal: true,
        }));
    }

    const scrollToBottom = () => {
        boxEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
        <>
            <div className={classes.box}
                 onMouseEnter={() => setHoverChat()}>
                {isLoading &&
                    <p>Loading...</p>
                }

                <ul className="m-2">

                    {messages.map((message: Message, index) =>
                        <li key={index}>
                            {communicateProps.userId === message.sender &&
                                <div className="d-flex flex-row-reverse">
                                    <div className="col-8">
                                        <div className="text-end">
                                    <span className="fs-6">
                                        {message.createdAt}
                                    </span>
                                            {/*<img src="https://bootdey.com/img/Content/avatar/avatar7.png"*/}
                                            {/*     alt="avatar"/>*/}
                                        </div>
                                        <div className="card">
                                            <div className="card-body rounded bg-info text-white">
                                                {message.content}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }

                            {communicateProps.userId !== message.sender &&
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
                            }
                        </li>
                    )}
                </ul>
                <div ref={boxEndRef}/>
            </div>
        </>
    )
}
export default CommunicateBox;