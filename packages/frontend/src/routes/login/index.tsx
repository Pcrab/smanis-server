// import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { canJump } from "../../utils/routes.js";
import { Routes, userType } from "../../utils/types.js";

const Login = () => {
    const jumpTo = useSearchParams()[0].get("jumpTo") || "/";
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = (username: string, password: string) => {
        username;
        password;
        const userType: userType = "student";
        if (canJump(userType, jumpTo as Routes)) {
            navigate(jumpTo);
        }
    };

    return (
        <>
            {jumpTo}
            <input
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <div
                onClick={() => {
                    void login(username, password);
                }}
            >
                login
            </div>
        </>
    );
};

export default Login;
