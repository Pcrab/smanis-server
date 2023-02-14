import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import getStudent from "../../utils/student/get.js";
import setStudent from "../../utils/student/set.js";
import { objectIdPattern, usernamePattern } from "../../utils/patterns.js";

const ChangeStudentRequest = Type.Object({
    studentId: Type.String(objectIdPattern),
    newUsername: Type.Optional(Type.String({ minLength: 2, maxLength: 128 })),
    newPassword: Type.Optional(
        Type.String({
            minLength: 8,
            maxLength: 128,
            // pattern:
            //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
        }),
    ),
    newAdminId: Type.Optional(objectIdPattern),
});
type ChangeStudentRequestType = Static<typeof ChangeStudentRequest>;

const ChangeStudentResponse = Type.Object({
    studentId: objectIdPattern,
    username: usernamePattern,
    passwordChanged: Type.Boolean(),
});
type ChangeStudentResponseType = Static<typeof ChangeStudentResponse>;

const changeStudent = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: ChangeStudentRequestType;
        Reply: ChangeStudentResponseType | httpErrors.HttpError;
    }>(
        "/changeStudent",
        {
            schema: {
                body: ChangeStudentRequest,
                response: {
                    201: ChangeStudentResponse,
                },
            },
        },
        async (request, response) => {
            // Verify Admin
            const adminId =
                verifyJwt(request.headers.authorization || "")?.id || "";
            const admin = await getAdmin(adminId);
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Admin ${adminId} not found`));
            }

            // Find Student
            const { studentId, newUsername, newPassword } = request.body;
            const student = await getStudent(studentId);
            if (!student) {
                return response
                    .status(404)
                    .send(
                        httpErrors.NotFound(`Student ${studentId} not found`),
                    );
            }
            if (!admin.isSuperAdmin && student.admin.toString() !== adminId) {
                return response
                    .status(401)
                    .send(
                        httpErrors.NotFound(
                            `Change student ${studentId} is not allowed`,
                        ),
                    );
            }

            // Change Student Info
            await setStudent(student, {
                username: newUsername,
                password: newPassword,
            });

            return response.status(201).send({
                studentId,
                username: student.username,
                passwordChanged: newPassword !== undefined,
            });
        },
    );
};

export default changeStudent;
