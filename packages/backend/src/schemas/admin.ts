// import { model, Schema, Types } from "mongoose";
import { model, Schema } from "mongoose";
// import autopopulate from "mongoose-autopopulate";
// import { studentModel } from "./student.js";

interface IAdmin {
    username: string;
    password: string;
    // students: Types.Array<Types.ObjectId>;
    isSuperAdmin: boolean;
    // createAt: Date;
    // lastActiveAt: Date;
}
const adminSchema = new Schema<IAdmin>(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        // students: {
        //     type: [
        //         {
        //             type: Schema.Types.ObjectId,
        //             ref: studentModel,
        //             // autopopulate: true,
        //         },
        //     ],
        //     required: true,
        //     default: [],
        // },
        isSuperAdmin: {
            type: Boolean,
            default: false,
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
        collection: "admins",
    },
);

// adminSchema.plugin(autopopulate.default);

const adminModel = model("admins", adminSchema);

export { adminSchema, adminModel, IAdmin };
