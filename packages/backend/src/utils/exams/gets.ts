import mongoose from "mongoose";
import { examModel, IExam } from "../../schemas/exam.js";
import IPI from "../populateInterface.js";

const getExams = async (props: {
    studentId: string;
    offset: number;
    count: number;
}): Promise<{
    hasNext: boolean;
    length: number;
    exams: IPI<IExam>[];
}> => {
    const { studentId, offset, count } = props;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const length = await examModel
        .find({ student: studentObjectId })
        .count()
        .exec();
    const exams = await examModel
        .find({ student: studentObjectId })
        .skip(offset)
        .limit(count)
        .exec();
    const hasNext = offset + count < length;
    return { length, hasNext, exams };
};

export default getExams;
