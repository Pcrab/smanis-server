import { model, Schema, Types } from "mongoose";
import { adminModel } from "./admin.js";
// import autopopulate from "mongoose-autopopulate";

interface ISimpleStudent {
    username: string;
    admin: Types.ObjectId;
}

interface IStudent extends ISimpleStudent {
    password: string;
    // createAt: Date;
    // lastActiveAt: Date;
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
        admin: {
            type: Schema.Types.ObjectId,
            ref: adminModel,
            required: true,
        },
        // createAt: {
        //     type: Date,
        //     required: true,
        //     default: () => {
        //         return Date.now();
        //     },
        // },
        // lastActiveAt: {
        //     type: Date,
        //     required: true,
        //     default: () => {
        //         return Date.now();
        //     },
        // },
    },
    {
        collection: "students",
    },
);

// studentSchema.plugin(autopopulate.default);

const studentModel = model("students", studentSchema);

export { studentSchema, studentModel, IStudent, ISimpleStudent };
