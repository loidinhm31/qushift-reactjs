import classes from "./Topic.module.css";

import React, {useEffect, useState} from "react";
import {retrieveTopics} from "../../../util/api";
import {NavLink} from "react-router-dom";


interface TopicType {
    id: string,
    name: string,
}

const Topic = () => {
    const [topicId, setTopicId] = useState("");

    const [topics, setTopics] = useState<TopicType[]>([]);

    useEffect(() => {
        retrieveTopics()
            .then((data) => {
                setTopics(data);
            })
            .catch((err) => console.log(err));

    }, []);

    function getTopic(e: React.MouseEvent<HTMLButtonElement>, id: string) {
        setTopicId(id);
    }

    return (
        <>
            <div id="plist">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fa fa-search"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="Search..."/>
                </div>

                <ul className="list-unstyled mt-2 mb-0">
                    {
                        topics.map((topic: TopicType, index) =>
                            <li key={index}
                                className={`${classes.item} ${topicId === topic.id ? `${classes.active}` : undefined}`}>
                                {/*<img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar"/>*/}

                                <NavLink
                                    onClick={(e: any) => getTopic(e, topic.id)}
                                    to={topic.id}
                                    className={({isActive}) => isActive ? classes.active : undefined}
                                    end
                                >
                                    <div className="about">
                                        <div className="fw-semibold">{topic.name}</div>
                                        <div className="fw-light fst-italic fs-6"><i
                                            //TODO check online/offline
                                            className={`${classes.offline} fa fa-circle`}></i> left 7 mins ago
                                        </div>
                                    </div>
                                </NavLink>


                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    );
}

export default Topic;