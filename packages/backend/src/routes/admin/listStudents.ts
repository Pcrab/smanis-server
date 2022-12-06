import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import { getStudents } from "../../utils/admin/students.js";

const ListStudentsRequest = Type.Object({
    // Require superAdmin
    id: Type.String(),
    offset: Type.Integer(),
    count: Type.Integer(),
});
type ListStudentsRequestType = Static<typeof ListStudentsRequest>;

const ListStudentsResponse = Type.Object({
    hasNext: Type.Boolean(),
    length: Type.Integer(),
    students: Type.Array(
        Type.Object({
            id: Type.String(),
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
            const id = request.query.id;
            const { id: userId = "", type } =
                verifyJwt(request.headers.authorization) || {};
            if (type === "admin" && id != userId) {
                return response
                    .status(401)
                    .send(httpErrors.Unauthorized("Unauthorized"));
            }
            const { offset, count } = request.query;
            const searchResult = await getStudents(id, offset, count);
            if (offset >= searchResult.length) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound("No student matched"));
            }
            const students = searchResult.students.map((student) => {
                return {
                    id: student._id.toString(),
                    username: student.username,
                    admin: student.admin._id.toString(),
                };
            });
            return response.status(200).send({ ...searchResult, students });
        },
    );
};

export default listStudents;
