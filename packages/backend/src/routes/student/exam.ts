import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getExam from "../../utils/exams/get.js";
import getStudent from "../../utils/student/get.js";
import { objectIdPattern } from "../../utils/patterns.js";
import getAdmin from "../../utils/admin/get.js";

const ExamRequest = Type.Object({
    examId: objectIdPattern,
});
type ExamRequestType = Static<typeof ExamRequest>;

const ExamResponse = Type.Object({
    examId: Type.String(),
    video: Type.String(),
    score: Type.Integer(),
    points: Type.Record(Type.String(), Type.Number()),
    student: Type.String(),
    takenTime: Type.String(),
});
type ExamResponseType = Static<typeof ExamResponse>;

const exam = (fastify: FastifyInstance): void => {
    fastify.get<{
        Querystring: ExamRequestType;
        Reply: ExamResponseType | httpErrors.HttpError;
    }>(
        "/exam",
        {
            schema: {
                querystring: ExamRequest,
                response: {
                    200: ExamResponse,
                },
            },
        },
        async (request, response) => {
            const { examId } = request.query;
            const exam = await getExam(examId);
            if (!exam) {
                return response
                    .status(404)
                    .send(
                        httpErrors.NotFound(
                            `Exam with ID ${examId}  not found`,
                        ),
                    );
            }

            const { id: userId = "", type } =
                verifyJwt(request.headers.authorization) || {};
            if (type !== "superAdmin") {
                const studentId = exam.student._id.toString();
                if (type === "student" && userId !== studentId) {
                    return response
                        .status(401)
                        .send(
                            httpErrors.Unauthorized(
                                `Exam ${examId} is not your exam`,
                            ),
                        );
                } else {
                    const admin = await getAdmin(userId);
                    const student = await getStudent(exam.student._id);
                    if (
                        !admin ||
                        !student ||
                        admin._id.toString() !== student.admin._id.toString()
                    ) {
                        return response
                            .status(401)
                            .send(
                                httpErrors.Unauthorized(
                                    `Student ${exam.student._id.toString()} is not your student`,
                                ),
                            );
                    }
                }
            }
            return response.status(200).send({
                examId: exam._id.toString(),
                video: exam.video,
                score: exam.score,
                points: exam.points,
                student: exam.student._id.toString(),
                takenTime: exam.takenTime.toJSON(),
            });
        },
    );
};

export default exam;
