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

    const listInnerRef = useRef<HTMLDivElement | null>(null);
    const [currPage, setCurrPage] = useState(0); // storing current page number
    const [prevPage, setPrevPage] = useState(0); // storing prev page number
    const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

    // Clear messages when topic id change
    useEffect(() => {
        console.log("Changed id to " + communicateProps.topic.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        messages = [];
        setMessages(messages);

        // Reset page to 0
        setCurrPage(0);
        setPrevPage(0);
        setWasLastList(false);

    }, [communicateProps.topic.id])

    // Get history messages
    useEffect(() => {
        console.log(`Getting history for id ${communicateProps.topic.id}...${currPage}`);
        retrieveMessages(communicateProps.topic.id, 0)
            .then((data) => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                messages = data;
                setMessages(messages);
                setIsLoading(false);
            })
            .finally(() => scrollToBottom())
            .catch((err) => console.log(err));

    }, [communicateProps.topic.id]);

    // Pagination when scroll to top
    useEffect(() => {
        console.log(`Updating list, current page is ${currPage}...`);
        if (!wasLastList && prevPage !== currPage) {
            setIsLoading(true);
            retrieveMessages(communicateProps.topic.id, currPage)
                .then((data) => {
                    if (!data.length) {
                        setWasLastList(true)
                    } else {
                        setPrevPage(currPage);
                        setMessages([...data, ...messages]);
                    }
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    setIsLoading(false);
                    listInnerRef.current?.scrollTo({top: 700, left: 0, behavior: 'smooth'})
                });
        }
    }, [currPage])

    // Callback for listening the incoming message
    const streamMessage = useCallback((tailMessage: Message) => {
        console.log(`Updating stream for id ${communicateProps.topic.id}...`);

        messages.push(tailMessage);
        setMessages([...messages]);

        scrollToBottom();
    }, [communicateProps.topic.id, messages]);

    // Control event source to work with SSE for the incoming message
    useEffect(() => {
        if (communicateProps.topic.id !== "") {
            console.log(`Opening stream for id ${communicateProps.topic.id}...`)

            const url = `${environment.apiBaseUrl}/messages/stream?topicId=${communicateProps.topic.id}`;

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
                console.log(`Closing stream for id ${communicateProps.topic.id}...`);
                eventSource.close();
            };
        }
    }, [communicateProps.topic.id])

    const setHoverChat = () => {
        setCommunicateProps((prop: any) => ({
            ...prop,
            sendSignal: true,
        }));
    }

    const scrollToBottom = () => {
        boxEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    const onScrollToTop = () => {
        if (listInnerRef.current) {
            const {scrollTop} = listInnerRef.current;
            if (scrollTop === 0) {
                setCurrPage(currPage + 1);
            }
        }
    };

    return (
        <>
            <div className={classes.box}
                 onMouseEnter={() => setHoverChat()}
                 onScroll={onScrollToTop}
                 ref={listInnerRef}
            >
                {isLoading &&
                    <p>Loading...</p>
                }


                <ul className="m-2">

                    {messages.map((message: Message, index) =>
                        <li key={index}>
                            {communicateProps.user.id === message.sender &&
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

                            {communicateProps.user.id !== message.sender &&
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