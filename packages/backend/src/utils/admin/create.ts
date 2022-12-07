import { adminModel } from "../../schemas/admin.js";
import create from "../create.js";
import { encryptPwd } from "../crypto.js";

const createAdmin = async (
    username: string,
    password: string,
    isSuperAdmin: boolean,
) => {
    const admin = create(adminModel, {
        username,
        password: await encryptPwd(password),
        isSuperAdmin,
    });
    return admin;
};

export default createAdmin;
