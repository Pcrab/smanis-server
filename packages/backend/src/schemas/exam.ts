import { model, Schema, Types } from "mongoose";
import { studentModel } from "./student.js";

type IExam = {
    video: string;
    score: number;
    points: Types.Map<number>;
    student: Types.ObjectId;
    takenTime: Date;
    // lastUpdateTime: Date;
};
const examSchema = new Schema<IExam>(
    {
        video: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        points: {
            type: Map,
            of: Number,
            required: true,
            default: {},
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: studentModel,
            required: true,
        },
        takenTime: {
            type: Date,
            required: true,
            default: () => {
                return Date.now();
            },
        },
        // lastUpdateTime: {
        //     type: Date,
        //     required: true,
        //     default: () => {
        //         return Date.now();
        //     },
        // },
    },
    {
        collection: "exams",
    },
);

const examModel = model("exams", examSchema);

export { examSchema, examModel, IExam };
