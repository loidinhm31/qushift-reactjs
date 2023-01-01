import classes from "./MessageLayout.module.css";

import {Outlet} from 'react-router-dom';
import React from "react";
import Topic from "./Topic/Topic";


const MessageLayout = () => {

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mb-5">
                            <div className="row mx-2 my-2">
                                <div className="col-sm-3">
                                    <Topic/>
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
                                                <a href="src/app/core/components#!" className="btn btn-outline-primary"><i
                                                    className="fa fa-image"></i></a>
                                                <a href="src/app/core/components#!" className="btn btn-outline-info"><i
                                                    className="fa fa-cogs"></i></a>
                                                <a href="src/app/core/components#!" className="btn btn-outline-warning"><i
                                                    className="fa fa-question"></i></a>
                                            </div>
                                        </div>

                                        {/*<CommunicateBox/>*/}
                                        <Outlet/>

                                        <div className={classes.chatMessage}>
                                            <div className="input-group mb-0">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i
                                                        className="fa fa-send"></i></span>
                                                </div>
                                                <input type="text" className="form-control"
                                                       placeholder="Enter text here..."/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

export default MessageLayout;
