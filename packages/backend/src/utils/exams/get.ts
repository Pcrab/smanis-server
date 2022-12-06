import { examModel } from "../../schemas/exam.js";

const getExam = async (id: string) => {
    return await examModel.findById(id).exec();
};

export default getExam;
