import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./app/core/components/Error/ErrorPage";
import Home from "./app/core/components/Home";
import RootLayout from "./app/core/components/RootLayout";
import Communicate from "./app/core/components/Messages/Communicate";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {index: true, element: <Home/>},

            {
                path: "/communication",
                element: <Communicate/>,
            }
        ]
    }
])

function App() {

    return <RouterProvider router={router}/>;
}

export default App;
