import { Document } from "mongoose";
import { IAdmin } from "../../schemas/admin.js";
import { IStudent } from "../../schemas/student.js";
import { encryptPwd } from "../crypto.js";
import IPI from "../populateInterface.js";
import set from "../set.js";

const setStudent = async (
    student: Document & IStudent,
    studentProps: {
        username?: string | undefined;
        password?: string | undefined;
        admin?: IPI<IAdmin> | undefined;
    },
) => {
    const finalProps = {
        username: studentProps.username,
        password:
            studentProps.password && (await encryptPwd(studentProps.password)),
        admin: studentProps.admin,
    };
    await set<IStudent>(student, finalProps);
};

export default setStudent;
