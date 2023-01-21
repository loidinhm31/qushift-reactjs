import classes from "./InputBox.module.css";

import React, {useCallback, useContext, useEffect, useState} from "react";
import {sendMessage} from "../../../util/api";
import {CommunicateCtx} from "../Communicate";

const InputBox = () => {
    const communicateProps = useContext(CommunicateCtx);

    const [msg, setMsg] = useState("");
    const [isComplete, setComplete] = useState(false);

    const clearBox = useCallback(() => {
        setMsg("");
    }, [msg]);

    useEffect(() => {
        if (isComplete) {
            clearBox();
            setComplete(false);
        }
    }, [isComplete, clearBox]);

    const handleSubmit = () => {
        if (msg.trim().length !== 0) {
            sendMessage(
                {
                    content: msg,
                    receiver: "test-b", // TODO
                    sender: communicateProps.user.id,  // TODO
                    topicId: communicateProps.topic.id,
                }
            ).finally(() => {
                setComplete(true);
            });
        }
    }

    const handleEnterSubmit = (event: any) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    return (
        <>
            <div className="input">
                <div className="input-group mb-0">
                    <div className={`${classes.send} mx-2`}>
                        <span className="input-group-text py-3"
                              onClick={handleSubmit}>
                            <i className="fa fa-send"></i>
                        </span>
                    </div>

                    <input
                        type="input"
                        className="form-control"
                        name="msg"
                        value={msg}
                        onInput={(event: any) => setMsg(event.target.value)}
                        onKeyDown={(event: any) => handleEnterSubmit(event)}
                    />

                </div>
            </div>
        </>
    )
}

export default InputBox;