import mongoose from "mongoose";
import { ISimpleStudent, studentModel } from "../../schemas/student.js";
import IPI from "../populateInterface.js";

const getStudents = async (
    id: string,
    offset: number,
    count: number,
): Promise<{
    hasNext: boolean;
    length: number;
    students: IPI<ISimpleStudent>[];
}> => {
    const adminObjectId = new mongoose.Types.ObjectId(id);
    const length = await studentModel
        .find({ admin: adminObjectId })
        .count()
        .exec();
    const students = await studentModel
        .find({ admin: adminObjectId })
        .skip(offset)
        .limit(count)
        .exec();
    const hasNext = offset + count < length;
    return { length, hasNext, students };
};

export { getStudents };
