import { Document } from "mongoose";
import { IExam, IExamUpdate } from "../../schemas/exam.js";
import set from "../set.js";

const setExam = async (
    exam: Document & IExam,
    points: Record<string, number>,
) => {
    const score = Object.values(points).reduce((pre, cur) => pre + cur);
    const finalProps = {
        score,
        points,
    };
    await set<IExamUpdate>(exam, finalProps);
};

export default setExam;
