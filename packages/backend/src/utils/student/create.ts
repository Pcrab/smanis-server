import { IAdmin } from "../../schemas/admin.js";
import { studentModel } from "../../schemas/student.js";
import create from "../create.js";
import { encryptPwd } from "../crypto.js";
import IPI from "../populateInterface.js";

const createStudent = async (
    username: string,
    password: string,
    admin: IPI<IAdmin>,
) => {
    const student = create(studentModel, {
        username,
        password: await encryptPwd(password),
        admin,
    });
    return student;
};

export default createStudent;
