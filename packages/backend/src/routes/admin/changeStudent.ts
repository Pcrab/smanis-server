import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { adminModel } from "../../schemas/admin.js";
import { studentModel } from "../../schemas/student.js";
import { encryptPwd, verifyJwt } from "../../utils/crypto.js";
import httpErrors from "http-errors";

const ModifyRequest = Type.Object({
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
type ModifyRequestType = Static<typeof ModifyRequest>;

const ModifyResponse = Type.Object({
    id: Type.String(),
    username: Type.String(),
    passwordChanged: Type.Boolean(),
});
type ModifyResponseType = Static<typeof ModifyResponse>;

const modify = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: ModifyRequestType;
        Reply: ModifyResponseType | httpErrors.HttpError;
    }>(
        "/changeStudent",
        {
            schema: {
                body: ModifyRequest,
                response: {
                    201: ModifyResponse,
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

export default modify;