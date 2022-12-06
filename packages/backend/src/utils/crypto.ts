import argon2 from "argon2";
import jwt from "jsonwebtoken";
import isProduction from "./isProduction.js";

const encryptPwd = async (plain: string): Promise<string> => {
    return await argon2.hash(plain);
};

const verifyPwd = async (hash: string, plain: string): Promise<boolean> => {
    try {
        return await argon2.verify(hash, plain);
    } catch (e) {
        console.log(e);
        return false;
    }
};

const getSecret = (): string => {
    return process.env.JWT_SECRET || "";
};

const signJwt = (
    id: string,
    type: string,
    expiresIn?: number | string,
): string => {
    if (expiresIn) {
        return jwt.sign({ id, type }, getSecret(), {
            algorithm: "HS256",
            expiresIn: expiresIn,
        });
    } else {
        return jwt.sign({ id, type }, getSecret());
    }
};

const verifyJwt = (token = ""): { id: string; type: string } | undefined => {
    try {
        return jwt.verify(token, getSecret()) as { id: string; type: string };
    } catch (e) {
        if (!isProduction()) {
            console.log(e);
        }
        return;
    }
};

export { encryptPwd, verifyPwd, signJwt, verifyJwt };
