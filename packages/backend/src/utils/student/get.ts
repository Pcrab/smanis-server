import { Types } from "mongoose";
import { IStudent, studentModel } from "../../schemas/student.js";
import get from "../get.js";

const getStudent = async (studentId: string | Types.ObjectId) => {
    return await get<IStudent>(studentModel, studentId);
};

export default getStudent;
