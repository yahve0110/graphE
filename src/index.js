import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/global.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import LoginPage from "./components/screens/auth/LoginPage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
