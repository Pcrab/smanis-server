import { model, Schema } from "mongoose";

const examSchema = new Schema(
    {
        videos: {
            type: Map,
            of: String,
            required: true,
            default: [],
        },
        score: {
            type: Number,
            required: true,
        },
        points: {
            type: Map,
            of: Number,
            required: true,
            default: [],
        },
        takenTime: {
            type: Date,
            required: true,
            default: () => {
                return Date.now();
            },
        },
        lastUpdateTime: {
            type: Date,
            required: true,
            default: () => {
                return Date.now();
            },
        },
    },
    {
        collection: "exams",
    },
);

const examModel = model("exams", examSchema);

export { examSchema, examModel };
