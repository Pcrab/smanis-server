import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getStudents from "../../utils/student/gets.js";
import { objectIdPattern } from "../../utils/patterns.js";
import getAdmin from "../../utils/admin/get.js";

const StudentsRequest = Type.Object({
    // Require superAdmin
    adminId: Type.Optional(objectIdPattern),
    offset: Type.Integer(),
    count: Type.Integer(),
});
type StudentsRequestType = Static<typeof StudentsRequest>;

const StudentsResponse = Type.Object({
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
type StudentsResponseType = Static<typeof StudentsResponse>;

const students = (fastify: FastifyInstance): void => {
    fastify.get<{
        Querystring: StudentsRequestType;
        Reply: StudentsResponseType | httpErrors.HttpError;
    }>(
        "/students",
        {
            schema: {
                querystring: StudentsRequest,
                response: {
                    200: StudentsResponse,
                },
            },
        },
        async (request, response) => {
            // Set query admin id
            const userId = verifyJwt(request.headers.authorization)?.id || "";
            const admin = await getAdmin(userId);
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound("Admin not found."));
            }
            const { adminId, offset, count } = request.query;
            if (adminId && adminId !== userId && !admin.isSuperAdmin) {
                return response
                    .status(403)
                    .send(
                        httpErrors.Forbidden(
                            "Need to be superAdmin to get other admin's students.",
                        ),
                    );
            }
            const searchResult = await getStudents({
                adminId: adminId || userId,
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

export default students;
