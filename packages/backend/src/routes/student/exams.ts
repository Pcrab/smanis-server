import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getExams from "../../utils/exams/gets.js";
import getStudent from "../../utils/student/get.js";

const ExamsRequest = Type.Object({
    studentId: Type.String(),
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
            if (type === "student" && studentId != userId) {
                return response
                    .status(401)
                    .send(httpErrors.Unauthorized("Unauthorized"));
            }
            const student = await getStudent(studentId);
            if (type === "admin" && student?.admin._id.toString() !== userId) {
                return response
                    .status(401)
                    .send(httpErrors.Unauthorized("Not your student"));
            }
            const { hasNext, length, exams } = await getExams({
                studentId,
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
