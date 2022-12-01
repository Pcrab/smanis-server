import { model as Model, Schema } from "mongoose";
import { examModel } from "./exam.js";
// import autopopulate from "mongoose-autopopulate";

const studentSchema = new Schema(
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

const studentModel = Model("students", studentSchema);

export { studentSchema, studentModel };
