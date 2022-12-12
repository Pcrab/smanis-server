import { Model, Types } from "mongoose";

const get = async <T extends object>(
    model: Model<T>,
    userId: string | Types.ObjectId,
) => {
    return await model.findById(userId).exec();
};

export default get;
