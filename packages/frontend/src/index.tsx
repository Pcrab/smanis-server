import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import style from "./index.module.scss";
import remoteUrl from "./utils/url.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admins from "./routes/admins/index.js";
import Students from "./routes/students/index.js";
import Exam from "./routes/exam/index.js";
import Login from "./routes/login/index.js";
import useLogin from "./hooks/useLogin.js";

const Index = () => {
    useLogin();
    return <>index</>;
};

const routes = createBrowserRouter([
    // all
    { path: "/", element: <Index /> },
    { path: "/login", element: <Login /> },
    // "examDetails",

    // admins
    { path: "/students", element: <Students /> },
    // "studentDetails",

    // super admin only
    { path: "/admins", element: <Admins /> },
    // "adminDetails",

    // students
    { path: "/exam", element: <Exam /> },
    // "check",
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={routes} />
        <div className={style.test}>{remoteUrl}</div>
    </React.StrictMode>,
);
