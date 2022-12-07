import { examModel, IExam } from "../../schemas/exam.js";
import get from "../get.js";

const getExam = async (examId: string) => {
    return await get<IExam>(examModel, examId);
};

export default getExam;
