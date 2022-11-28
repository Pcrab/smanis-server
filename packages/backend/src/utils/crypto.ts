import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";

const encryptPwd = async (plain: string): Promise<string> => {
    return await argon2.hash(plain);
};

const verifyPwd = async (hash: string, plain: string): Promise<boolean> => {
    return await argon2.verify(hash, plain);
};

const getSecret = (): string => {
    return process.env.JWT_SECRET || "";
};

const signJwt = (data: {
    payload: string;
    expiresIn?: number | string;
}): string => {
    if (data.expiresIn) {
        return jwt.sign(data.payload, getSecret(), {
            algorithm: "HS256",
            expiresIn: data.expiresIn || 3600,
        });
    } else {
        return jwt.sign(data.payload, getSecret());
    }
};

const verifyJwt = (token: string): string | JwtPayload => {
    let decoded: string | JwtPayload = "";
    jwt.verify(token, getSecret(), (err, result) => {
        if (err || !result) {
            throw err;
        }
        decoded = result;
    });
    return decoded;
};

export { encryptPwd, verifyPwd, signJwt, verifyJwt };
