import React from "react";

import ReactDOM from "react-dom/client";
import "./index.scss";
import style from "./index.module.scss";
import remoteUrl from "./utils/url.js";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <div className={style.test}>{remoteUrl}</div>
    </React.StrictMode>,
);
