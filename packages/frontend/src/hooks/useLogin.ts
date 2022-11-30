import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStorageItem } from "../utils/storage.js";

const useLogin = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const authKey = getStorageItem("authKey");
        const userType = getStorageItem("userType");

        if (authKey && userType) {
            return;
        }
        navigate("/login");
    }, []);
};

export default useLogin;
