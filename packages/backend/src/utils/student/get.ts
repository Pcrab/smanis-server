import { studentModel } from "../../schemas/student.js";

const getStudent = async (studentId: string) => {
    return await studentModel.findById(studentId).exec();
};

export default getStudent;
