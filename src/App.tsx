import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./app/core/components/Error/ErrorPage";
import Home from "./app/core/components/Home";
import RootLayout from "./app/core/components/RootLayout";
import MessageLayout from "./app/core/components/Messages/MessageLayout";
import CommunicateBox from "./app/core/components/Messages/CommunicateBox/CommunicateBox";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {index: true, element: <Home/>},

            {
                path: "/messages",
                element: <MessageLayout/>,
                children: [
                    {
                        path: ":id",
                        element: <CommunicateBox/>
                    }
                ]
            }
        ]
    }
])

function App() {

    return <RouterProvider router={router}/>;
}

export default App;
