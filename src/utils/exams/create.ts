import { examModel } from "../../schemas/exam.js";
import { IStudent } from "../../schemas/student.js";
import create from "../create.js";
import IPI from "../populateInterface.js";

const createExam = async (
    video: string,
    score: number,
    points: Record<string, number>,
    student: IPI<IStudent>,
) => {
    const exam = create(examModel, {
        video,
        score,
        points,
        student,
        takenTime: new Date(Date.now()),
    });
    return exam;
};

export default createExam;
