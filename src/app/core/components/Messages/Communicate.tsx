import classes from "./Communicate.module.css";
import React, {createContext, Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import InputBox from "./InputBox/InputBox";
import CommunicateBox from "./CommunicateBox/CommunicateBox";
import {retrieveTopics, sendSignal} from "../../util/api";
import {environment} from "../../../environments/environment";
import {CommunicatePropInterface, MemberInterface, TopicInterface} from "./InputBox/CommunicateInterface";

export const CommunicateCtx = createContext<any>({});

const Communicate = () => {

    const [communicateProps, setCommunicateProps] = useState<CommunicatePropInterface>(
        {
            userId: "test-a",
            topicId: "",
            sendSignal: false
        }
    );

    const [topics, setTopics] = useState<TopicInterface[]>([]);

    const [msgMap, setMsgMap] = useState<Map<string, string>>(new Map());
    const [isUpdate, setUpdate] = useState(false);

    // Update context value from consumer
    const value = useMemo(() => (
        {communicateProps, setCommunicateProps}
    ), [communicateProps]);

    // Get all topics
    useEffect(() => {
        retrieveTopics()
            .then((data) => {
                setTopics(data);
            })
            .catch((err) => console.log(err));

    }, []);

    // Callback for listening the incoming notify
    const streamNotification = useCallback((topic: TopicInterface) => {
        console.log("Updating notification for receiver...")

        // TODO hard code user value test-a
        const user = topic.members?.find(member => member.user === communicateProps.userId) as MemberInterface;

        if (!user.checkSeen) {
            if (msgMap.has(topic.id)) {
                const countSeen = user.notSeenCount;

                if (countSeen > 99) {
                    msgMap.set(topic.id, "99+");
                } else {
                    msgMap.set(topic.id, countSeen.toString());
                }
            } else {
                msgMap.set(topic.id, user.notSeenCount.toString());
            }
        } else {
            msgMap.set(topic.id, "0");
        }

        setMsgMap(msgMap);
        setUpdate(true);
    }, [msgMap]);

    // Set update notify for each topic in map
    useEffect(() => {
        setUpdate(false);
    }, [isUpdate]);

    // Control event source to work with SSE for incoming notify
    useEffect(() => {
        const url = `${environment.apiBaseUrl}/topics/stream/${communicateProps.userId}`;
        const eventSource = new EventSource(url);

        eventSource.onopen = (event: any) => console.log("open", event);

        eventSource.onmessage = (event: any) => {
            const topic: TopicInterface = JSON.parse(event.data);
            streamNotification(topic);
        }

        eventSource.onerror = (event: any) => {
            console.log("error", event);
            if (event.readyState === EventSource.CLOSED) {
                eventSource.close();
            }
        };

        return () => {
            console.log(`Closing stream for receiver...`);
            eventSource.close();
        };
    }, [])

    // Send seen signal to server
    useEffect(() => {
        if (communicateProps.sendSignal) {
            if (msgMap.get(communicateProps.topicId) !== "0" &&
                msgMap.get(communicateProps.topicId) !== undefined) {

                console.log(`Sending signal for ${communicateProps.topicId}...`);
                sendSignal(communicateProps.topicId)
                    .finally(() => {
                        msgMap.set(communicateProps.topicId, "0");
                    });
            }
        }
    }, [communicateProps])

    const setTopic = (id: string) => {
        setCommunicateProps((prop) => ({
            ...prop,
            topicId: id,
        }));
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mb-5">
                            <div className="row mx-2 my-2">
                                <Fragment>
                                    <div className="col-sm-3">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i
                                                    className="fa fa-search"></i></span>
                                            </div>
                                            <input type="text" className="form-control" placeholder="Search..."/>
                                        </div>

                                        <div className={classes.topic}>
                                            <ul className="list-unstyled mt-2 mb-0">
                                                {topics.map((topic: TopicInterface, index) =>
                                                    <li key={index}
                                                        className={`${classes.item} ${communicateProps.topicId === topic.id ? `${classes.active}` : undefined}`}>
                                                        {/*<img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar"/>*/}

                                                        <div className={classes.about}
                                                             onClick={() => setTopic(topic.id)}
                                                        >

                                                            {msgMap.get(topic.id) !== "0" &&
                                                                <span
                                                                    className="col-2 badge rounded-pill bg-danger float-end">{msgMap.get(topic.id)}</span>
                                                            }

                                                            <div className="fw-semibold">
                                                                <p className="col-6">{topic.name}</p>
                                                            </div>

                                                            <div className="fw-light fst-italic fs-6"><i
                                                                //TODO check online/offline
                                                                className={`${classes.offline} fa fa-circle`}></i> left
                                                                7 mins ago
                                                            </div>

                                                        </div>

                                                    </li>
                                                )
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-sm-9">
                                        <div className="box-header">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <a href="src/app/core/components#!" data-toggle="modal"
                                                       data-target="#view_info">
                                                        {/*<img src="https://bootdey.com/img/Content/avatar/avatar2.png"*/}
                                                        {/*     alt="avatar"/>*/}
                                                    </a>
                                                    <div className={classes.chatAbout}>
                                                        <h6 className="fw-bold mb-2">Aiden Chavez</h6>
                                                        <small>Last seen: 2 hours ago</small>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 hidden-sm text-end">
                                                    <a href="src/app/core/components#!"
                                                       className="btn btn-outline-secondary"><i
                                                        className="fa fa-camera"></i></a>
                                                    <a href="src/app/core/components#!"
                                                       className="btn btn-outline-primary"><i
                                                        className="fa fa-image"></i></a>
                                                    <a href="src/app/core/components#!"
                                                       className="btn btn-outline-info"><i
                                                        className="fa fa-cogs"></i></a>
                                                    <a href="src/app/core/components#!"
                                                       className="btn btn-outline-warning"><i
                                                        className="fa fa-question"></i></a>
                                                </div>
                                            </div>

                                            <CommunicateCtx.Provider value={value}>
                                                <CommunicateBox/>
                                            </CommunicateCtx.Provider>


                                            <CommunicateCtx.Provider value={communicateProps}>
                                                <InputBox/>
                                            </CommunicateCtx.Provider>

                                        </div>
                                    </div>
                                </Fragment>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

export default Communicate;