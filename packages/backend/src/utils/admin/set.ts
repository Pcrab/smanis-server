import { Document } from "mongoose";
import { IAdmin } from "../../schemas/admin.js";
import { encryptPwd } from "../crypto.js";
import set from "../set.js";

const setAdmin = async (
    admin: Document & IAdmin,
    adminProps: {
        username?: string | undefined;
        password?: string | undefined;
        isSuperAdmin?: boolean | undefined;
    },
) => {
    const finalProps = {
        username: adminProps.username,
        password:
            adminProps.password && (await encryptPwd(adminProps.password)),
        isSuperAdmin: adminProps.isSuperAdmin,
    };
    await set<IAdmin>(admin, finalProps);
};

export default setAdmin;
