import { model, Schema } from "mongoose";
import IPI from "../utils/populateInterface.js";
import { adminModel } from "./admin.js";
// import autopopulate from "mongoose-autopopulate";

type ISimpleStudent = {
    username: string;
    admin: IPI<object>;
};

type IStudent = ISimpleStudent & {
    password: string;
    // createAt: Date;
    // lastActiveAt: Date;
};
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
