import mongoose, { Types } from "mongoose";
import { ISimpleStudent, studentModel } from "../../schemas/student.js";
import IPI from "../populateInterface.js";

const getStudents = async (props: {
    adminId: string | Types.ObjectId;
    offset: number;
    count: number;
}): Promise<{
    hasNext: boolean;
    length: number;
    students: IPI<ISimpleStudent>[];
}> => {
    const { adminId, offset, count } = props;
    const adminObjectId = new mongoose.Types.ObjectId(adminId);
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

export default getStudents;
