import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getStudents from "../../utils/student/gets.js";

const ListStudentsRequest = Type.Object({
    // Require superAdmin
    adminId: Type.String(),
    offset: Type.Integer(),
    count: Type.Integer(),
});
type ListStudentsRequestType = Static<typeof ListStudentsRequest>;

const ListStudentsResponse = Type.Object({
    hasNext: Type.Boolean(),
    length: Type.Integer(),
    students: Type.Array(
        Type.Object({
            studentId: Type.String(),
            username: Type.String(),
            admin: Type.String(),
        }),
    ),
});
type ListStudentsResponseType = Static<typeof ListStudentsResponse>;

const listStudents = (fastify: FastifyInstance): void => {
    fastify.get<{
        Querystring: ListStudentsRequestType;
        Reply: ListStudentsResponseType | httpErrors.HttpError;
    }>(
        "/listStudents",
        {
            schema: {
                querystring: ListStudentsRequest,
                response: {
                    200: ListStudentsResponse,
                },
            },
        },
        async (request, response) => {
            // Set query admin id
            const { adminId, offset, count } = request.query;
            const { id: userId = "", type } =
                verifyJwt(request.headers.authorization) || {};
            if (type === "admin" && adminId != userId) {
                return response
                    .status(401)
                    .send(httpErrors.Unauthorized("Unauthorized"));
            }
            const searchResult = await getStudents({
                adminId,
                offset,
                count,
            });
            const students = searchResult.students.map((student) => {
                return {
                    studentId: student._id.toString(),
                    username: student.username,
                    admin: student.admin._id.toString(),
                };
            });
            return response.status(200).send({ ...searchResult, students });
        },
    );
};

export default listStudents;
