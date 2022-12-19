import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getExams from "../../utils/exams/gets.js";
import getStudent from "../../utils/student/get.js";
import { objectIdPattern } from "../../utils/patterns.js";
import getAdmin from "../../utils/admin/get.js";

const ExamsRequest = Type.Object({
    studentId: Type.Optional(objectIdPattern),
    offset: Type.Integer(),
    count: Type.Integer(),
});
type ExamsRequestType = Static<typeof ExamsRequest>;

const ExamsResponse = Type.Object({
    hasNext: Type.Boolean(),
    length: Type.Integer(),
    exams: Type.Array(
        Type.Object({
            studentId: Type.String(),
            score: Type.Integer(),
            takenTime: Type.String(),
        }),
    ),
});
type ExamsResponseType = Static<typeof ExamsResponse>;

const exams = (fastify: FastifyInstance): void => {
    fastify.get<{
        Querystring: ExamsRequestType;
        Reply: ExamsResponseType | httpErrors.HttpError;
    }>(
        "/exams",
        {
            schema: {
                querystring: ExamsRequest,
                response: {
                    200: ExamsResponse,
                },
            },
        },
        async (request, response) => {
            const { studentId, offset, count } = request.query;
            const { id: userId = "", type } =
                verifyJwt(request.headers.authorization) || {};
            let id = "";
            if (type === "student") {
                id = userId;
            } else {
                if (!studentId) {
                    return response
                        .status(400)
                        .send(httpErrors.BadRequest("StudentId is required"));
                }
                const admin = await getAdmin(userId);
                const student = await getStudent(studentId);
                if (
                    !admin ||
                    !student ||
                    (!admin.isSuperAdmin &&
                        student.admin._id.toString() !== admin._id.toString())
                ) {
                    return response
                        .status(403)
                        .send(httpErrors.Forbidden("Not your student"));
                }
                id = student._id.toString();
            }
            const { hasNext, length, exams } = await getExams({
                studentId: id,
                offset,
                count,
            });
            return response.status(200).send({
                hasNext,
                length,
                exams: exams.map((exam) => {
                    return {
                        studentId: exam._id.toString(),
                        score: exam.score,
                        takenTime: exam.takenTime.toJSON(),
                    };
                }),
            });
        },
    );
};

export default exams;
