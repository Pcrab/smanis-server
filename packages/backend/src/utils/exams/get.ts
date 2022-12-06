import { examModel } from "../../schemas/exam.js";

const getExam = async (examId: string) => {
    return await examModel.findById(examId).exec();
};

export default getExam;
