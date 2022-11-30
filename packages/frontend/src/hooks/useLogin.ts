import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStorageItem } from "../utils/storage.js";
import { Routes } from "../utils/types.js";

const useLogin = (jumpTo?: Routes) => {
    const navigate = useNavigate();
    useEffect(() => {
        const authKey = getStorageItem("authKey");
        const userType = getStorageItem("userType");

        if (authKey && userType) {
            return;
        }
        navigate(`/login${jumpTo ? `?jumpTo=${jumpTo}` : ""}`);
    }, []);
};

export default useLogin;
