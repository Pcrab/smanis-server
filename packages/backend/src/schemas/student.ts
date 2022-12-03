import { model, Schema, Types } from "mongoose";
import { adminModel } from "./admin.js";
import { examModel } from "./exam.js";
// import autopopulate from "mongoose-autopopulate";

interface IStudent {
    username: string;
    password: string;
    exams: Types.Array<Types.ObjectId>;
    admin: Types.ObjectId;
    createAt: Date;
    lastActiveAt: Date;
}
const studentSchema = new Schema<IStudent>(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        exams: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: examModel,
                    // autopopulate: true,
                },
            ],
            required: true,
            default: [],
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: adminModel,
            required: true,
        },
        createAt: {
            type: Date,
            required: true,
            default: () => {
                return Date.now();
            },
        },
        lastActiveAt: {
            type: Date,
            required: true,
            default: () => {
                return Date.now();
            },
        },
    },
    {
        collection: "students",
    },
);

// studentSchema.plugin(autopopulate.default);

const studentModel = model("students", studentSchema);

export { studentSchema, studentModel, IStudent };
