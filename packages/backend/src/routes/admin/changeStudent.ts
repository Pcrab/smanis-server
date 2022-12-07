import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { encryptPwd, verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import getStudent from "../../utils/student/get.js";
import setStudent from "../../utils/student/set.js";

const ChangeStudentRequest = Type.Object({
    studentId: Type.String({ minLength: 12, maxLength: 24 }),
    newUsername: Type.Optional(Type.String({ minLength: 2, maxLength: 128 })),
    newPassword: Type.Optional(
        Type.String({
            minLength: 8,
            maxLength: 128,
            // pattern:
            //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
        }),
    ),
});
type ChangeStudentRequestType = Static<typeof ChangeStudentRequest>;

const ChangeStudentResponse = Type.Object({
    studentId: Type.String(),
    username: Type.String(),
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
            const { id: adminId = "", type = "" } =
                verifyJwt(request.headers.authorization || "") || {};
            console.log(adminId, type);
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
            if (type !== "superAdmin" && student.admin.toString() !== adminId) {
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
                password: newPassword && (await encryptPwd(newPassword)),
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
