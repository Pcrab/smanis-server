import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { digest, verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import getStudent from "../../utils/student/get.js";
import { objectIdPattern } from "../../utils/patterns.js";
import createExam from "../../utils/exams/create.js";
import client from "../../utils/oss.js";

type submitFileType = {
    toBuffer: () => Promise<Buffer>;
};

const SubmitExamRequest = Type.Object({
    video: Type.Object({
        filename: Type.String(),
        mimetype: Type.String(),
        // toBuffer: Type.Function([], Type.Unknown()),
    }),
    score: Type.Object({
        value: Type.Integer(),
    }),
    points: Type.Object({
        value: Type.String(),
    }),
    student: Type.Object({
        value: objectIdPattern,
    }),
});
type SubmitExamRequestType = Static<typeof SubmitExamRequest>;

const SubmitExamResponse = Type.Object({
    video: Type.String(),
    score: Type.Integer(),
    points: Type.Record(Type.String(), Type.Integer()),
    student: Type.String(),
});
type SubmitExamResponseType = Static<typeof SubmitExamResponse>;

const submitExam = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: SubmitExamRequestType;
        Reply: SubmitExamResponseType | httpErrors.HttpError;
    }>(
        "/submitExam",
        {
            schema: {
                body: SubmitExamRequest,
                response: {
                    201: SubmitExamResponse,
                },
            },
        },
        async (request, response) => {
            // Verify Admin
            const { id: adminId = "", type = "" } =
                verifyJwt(request.headers.authorization || "") || {};
            const admin = await getAdmin(adminId);
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Admin ${adminId} not found`));
            }

            // Find Student
            const {
                video: videoReq,
                score: scoreReq,
                points: pointsReq,
                student: studentIdReq,
            } = request.body;
            const video = await (
                videoReq as unknown as submitFileType
            ).toBuffer();
            const score = scoreReq.value;
            const points = JSON.parse(pointsReq.value) as Record<
                string,
                number
            >;

            // Verify points
            if (typeof points === "object") {
                for (const [key, value] of Object.entries(points)) {
                    const frame = parseInt(key);
                    const score = parseInt(value as unknown as string);
                    if (
                        !Number.isInteger(frame) ||
                        !Number.isInteger(score) ||
                        frame <= 0 ||
                        (score !== 8 && score !== 10)
                    ) {
                        return response
                            .status(400)
                            .send(
                                httpErrors.BadRequest(
                                    "points key and value must be number",
                                ),
                            );
                    }
                }
            } else {
                return response
                    .status(400)
                    .send(httpErrors.BadRequest("points must be an object"));
            }
            const studentId = studentIdReq.value;
            const student = await getStudent(studentId);
            if (!student) {
                return response
                    .status(404)
                    .send(
                        httpErrors.NotFound(`Student ${studentId} not found`),
                    );
            }
            if (type !== "superAdmin" && student.admin.toString() !== adminId) {
                return response
                    .status(401)
                    .send(
                        httpErrors.NotFound(
                            `Submit exam associate with student ${studentId} is not allowed`,
                        ),
                    );
            }

            // Upload video
            const currentTime = new Date(Date.now()).toJSON();
            const storePath = `${student._id.toString()}/${currentTime}-${digest(
                currentTime,
            )}-${Math.round(Math.random() * 100)}.mp4`;
            const url = (await client.put(storePath, video)).url;

            await createExam(url, score, points, student);

            return response.status(201).send({
                video: url,
                score,
                points,
                student: studentId,
            });
        },
    );
};

export default submitExam;
