import { model, Schema } from "mongoose";
import IPI from "../utils/populateInterface.js";
import { studentModel } from "./student.js";

type IExamUpdate = {
    score: number;
    points: Record<string, number>;
};

type IExam = IExamUpdate & {
    video: string;
    student: IPI<object>;
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
                return new Date(Date.now());
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

export { examSchema, examModel, IExam, IExamUpdate };
