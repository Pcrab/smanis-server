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
            const studentId = exam.student._id.toString();
            if (type === "admin") {
                const admin = await getAdmin(userId);
                if (!admin || !admin.isSuperAdmin) {
                    const student = await getStudent(studentId);
                    if (
                        !student ||
                        student.admin._id.toString() !== admin?._id.toString()
                    ) {
                        return response
                            .status(403)
                            .send(
                                httpErrors.Forbidden("Not your student's exam"),
                            );
                    }
                }
            } else {
                // Student
                if (userId !== studentId) {
                    return response
                        .status(401)
                        .send(
                            httpErrors.Unauthorized(
                                `Exam ${examId} is not your exam`,
                            ),
                        );
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
