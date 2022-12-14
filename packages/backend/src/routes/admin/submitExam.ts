import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import getStudent from "../../utils/student/get.js";
import { objectIdPattern } from "../../utils/patterns.js";
import createExam from "../../utils/exams/create.js";

const SubmitExamRequest = Type.Object({
    video: Type.String(),
    score: Type.Integer(),
    points: Type.Record(Type.String(), Type.Integer()),
    student: objectIdPattern,
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
            const { video, score, points, student: studentId } = request.body;
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

            await createExam(video, score, points, student);

            return response.status(201).send({
                video,
                score,
                points,
                student: studentId,
            });
        },
    );
};

export default submitExam;
