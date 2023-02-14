import { Types } from "mongoose";
import { examModel, IExam } from "../../schemas/exam.js";
import get from "../get.js";

const getExam = async (examId: string | Types.ObjectId) => {
    return await get<IExam>(examModel, examId);
};

export default getExam;
