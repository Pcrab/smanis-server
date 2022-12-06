import { studentModel } from "../../schemas/student.js";

const getStudent = async (id: string) => {
    return await studentModel.findById(id).exec();
};

export default getStudent;
