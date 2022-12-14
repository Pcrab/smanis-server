import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import getExam from "../../utils/exams/get.js";
import { objectIdPattern, pointsPattern } from "../../utils/patterns.js";
import getStudent from "../../utils/student/get.js";
import setExam from "../../utils/exams/set.js";

const ChangeExamRequest = Type.Object({
    examId: objectIdPattern,
    points: pointsPattern,
});
type ChangeExamRequestType = Static<typeof ChangeExamRequest>;

const ChangeExamResponse = Type.Object({
    examId: objectIdPattern,
    points: pointsPattern,
});
type ChangeExamResponseType = Static<typeof ChangeExamResponse>;

const changeExam = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: ChangeExamRequestType;
        Reply: ChangeExamResponseType | httpErrors.HttpError;
    }>(
        "/changeExam",
        {
            schema: {
                body: ChangeExamRequest,
                response: {
                    201: ChangeExamResponse,
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
            const { examId, points } = request.body;
            const exam = await getExam(examId);
            if (!exam) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Exam ${examId} not found`));
            }
            if (type !== "superAdmin") {
                const student = await getStudent(exam.student._id);
                if (!student || student.admin._id.toString() !== adminId) {
                    return response
                        .status(403)
                        .send(
                            httpErrors.Forbidden(
                                `Change exam ${examId} is not allowed`,
                            ),
                        );
                }
            }

            // Change Student Info
            await setExam(exam, points);

            return response.status(201).send({
                examId,
                points,
            });
        },
    );
};

export default changeExam;
