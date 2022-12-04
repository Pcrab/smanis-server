import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { adminModel } from "../../schemas/admin.js";
import { studentModel } from "../../schemas/student.js";
import { encryptPwd, verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";

const ChangeStudentRequest = Type.Object({
    id: Type.String({ minLength: 12, maxLength: 24 }),
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
    id: Type.String(),
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
            const adminObjectId = new mongoose.Types.ObjectId(adminId);
            const admin = await adminModel.findById(adminObjectId).exec();
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Admin ${adminId} not found`));
            }

            // Find Student
            const { id: studentId, newUsername, newPassword } = request.body;
            const studentObjectId = new mongoose.Types.ObjectId(studentId);
            const student = await studentModel.findById(studentObjectId).exec();
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
            if (newUsername) {
                student.username = newUsername;
            }
            if (newPassword) {
                student.password = await encryptPwd(newPassword);
            }
            await student.save();
            return response.status(201).send({
                id: student._id.toString(),
                username: student.username,
                passwordChanged: newPassword !== undefined,
            });
        },
    );
};

export default changeStudent;
