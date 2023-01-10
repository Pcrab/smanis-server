import { useNavigate } from "react-router-dom";
import { getStorageItem } from "../utils/storage.js";
import { Routes } from "../utils/types.js";
import { useEffect } from "react";

type wantType = "student" | "admin" | "superAdmin";

const verifyAuthkey = (authKey: string): boolean => {
    const splitResult = authKey.split(".");
    if (splitResult.length === 3) {
        return true;
    }
    return false;
};

const verifyUserType = (
    userType: string,
    isSuperAdmin: boolean,
    want?: wantType,
): boolean => {
    if (userType === "student" && want === "student") {
        return true;
    } else if (userType === "admin") {
        if (want === "admin") {
            return true;
        } else if (want === "superAdmin" && isSuperAdmin) {
            return true;
        }
    }
    return false;
};

const useLogin = (jumpTo?: Routes, want?: wantType): [string, boolean] => {
    const navigate = useNavigate();

    const authKey = getStorageItem("authKey");
    const userId = getStorageItem("userId");
    const userType = getStorageItem("userType");
    const isSuperAdmin = getStorageItem("isSuperAdmin") === "true";

    useEffect(() => {
        if (
            !userId ||
            !verifyAuthkey(authKey) ||
            !verifyUserType(userType, isSuperAdmin, want)
        ) {
            navigate(`/login${jumpTo ? `?jumpTo=${jumpTo}` : ""}`);
        }
    });

    return [userId, isSuperAdmin];
};

export default useLogin;
