import mongoose from "mongoose";

type IPI<T> = {
    _id: mongoose.Types.ObjectId;
} & T;

export default IPI;
